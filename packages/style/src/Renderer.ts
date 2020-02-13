import { isObject } from 'aesthetic-utils';
import { cssifyDeclaration, hyphenateProperty } from 'css-in-js-utils';
import AtomicCache from './AtomicCache';
import {
  ClassName,
  Properties,
  StyleParams,
  Property,
  Value,
  FontFace,
  Keyframes,
  SheetType,
  CacheItem,
} from './types';
import applyUnitToValue from './applyUnitToValue';
import generateHash from './generateHash';
import getDocumentStyleSheet from './getDocumentStyleSheet';
import isMediaQueryCondition from './isMediaQueryCondition';
import isSupportsCondition from './isSupportsCondition';
import isNestedSelector from './isNestedSelector';
import quoteString from './quoteString';

export interface QueueItem {
  callback?: (rank: number) => void;
  rule: string;
  type: SheetType;
}

export default class Renderer {
  // Testing purposes only
  flushedStyles: string = '';

  protected atRuleCache = new Set();

  protected classNameCache = new AtomicCache();

  protected frameTimer = 0;

  protected keyframesIndex = 0;

  protected ruleBuffer: QueueItem[] = [];

  constructor() {
    // Create the elements in a strict order
    getDocumentStyleSheet('global');
    getDocumentStyleSheet('low-pri');
    getDocumentStyleSheet('high-pri');
  }

  /**
   * Generate a unique and deterministic class name for a property value pair.
   */
  generateClassName(property: string, value: string, params: StyleParams): string {
    return generateHash(`${params.condition || ''}${params.selector || ''}${property}${value}`);
  }

  /**
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  // eslint-disable-next-line complexity
  render(properties: Properties, params: StyleParams = {}): ClassName {
    const props = Object.keys(properties);
    let classNames = '';

    for (let i = 0; i < props.length; i += 1) {
      const prop = props[i] as Property;
      const value = properties[prop];
      const valueType = typeof value;

      // Skip invalid values
      if (
        (valueType !== 'string' && valueType !== 'number' && valueType !== 'object') ||
        value === null ||
        value === undefined
      ) {
        if (__DEV__) {
          console.warn(`Invalid value "${value}" for property "${prop}".`);
        }

        // Handle nested selectors and objects
      } else if (isObject(value)) {
        // @media, @supports
        if (isMediaQueryCondition(prop) || isSupportsCondition(prop)) {
          classNames += this.render(value, { ...params, condition: prop });
          classNames += ' ';

          // [attribute], :pseudo, ::pseudo
        } else if (isNestedSelector(prop)) {
          classNames += this.render(value, { ...params, selector: prop });
          classNames += ' ';

          // Unknown
        } else if (__DEV__) {
          console.warn(`Unknown property selector "${prop}" with value "${value}".`);
        }

        // Property value pair
      } else {
        classNames += this.renderDeclaration(prop as Property, value, params);
        classNames += ' ';
      }
    }

    return classNames.trim();
  }

  /**
   * Render a property value pair into the defined style sheet as a single class name.
   */
  renderDeclaration<K extends Property>(
    property: K,
    value: Properties[K],
    params: StyleParams = {},
  ) {
    // Hyphenate early so all checks are deterministic
    const prop = hyphenateProperty(property);

    // Apply unit as well so that "0" and "0px" do not generate separate classes
    const val = applyUnitToValue(property, value as Value);

    // Check the cache immediately
    const cache = this.classNameCache.read(prop, val, params);

    if (cache) {
      return cache.className;
    }

    const className = this.generateClassName(prop, val, params);

    // Write to the cache immediately in case the same property:value is being rendered
    const item: CacheItem = {
      condition: '',
      selector: '',
      type: 'low-pri',
      ...params,
      className,
      rank: -1,
    };

    this.classNameCache.write(prop, val, item);

    // Enqueue the CSS rule but assign the rank once its been flushed.
    this.enqueueRule(
      this.formatRule(className, prop, val, params),
      params.type || 'low-pri',
      rank => {
        item.rank = rank;
      },
    );

    return className;
  }

  /**
   * Render any at-rule into the global style sheet.
   */
  renderAtRule(selector: string, properties: string | Properties) {
    const body =
      typeof properties === 'string' ? properties : this.formatDeclarationBlock(properties);
    const cacheKey = generateHash(selector + body);

    if (this.atRuleCache.has(cacheKey)) {
      return;
    }

    this.atRuleCache.add(cacheKey);

    this.enqueueAtRule(selector, body);
  }

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace(fontFace: FontFace): string {
    if (__DEV__) {
      if (!fontFace.fontFamily) {
        throw new Error('Font faces required a font family.');
      }
    }

    // Format font family so its deterministic
    const fontFamily = fontFace.fontFamily
      .split(',')
      .map(family => quoteString(family.trim()))
      .join(', ');

    fontFace.fontFamily = fontFamily;

    this.renderAtRule('@font-face', fontFace as Properties);

    return fontFamily;
  }

  /**
   * Render a `@keyframes` to the global style sheet and return the animation name.
   */
  renderKeyframes(keyframes: Keyframes, customName: string = ''): string {
    const steps = Object.keys(keyframes);
    let frames = '';

    for (let i = 0; i < steps.length; i += 1) {
      frames += `${steps[i]} { ${this.formatDeclarationBlock(keyframes[steps[i]]!)} }`;
      frames += ' ';
    }

    // A bit more deterministic than a counter
    const animationName = customName || `kf${generateHash(frames)}`;

    this.renderAtRule(`@keyframes ${animationName}`, frames);

    return animationName;
  }

  /**
   * Format a property value pair into a CSS declaration,
   * without wrapping brackets.
   */
  protected formatDeclaration(property: string, value: string): string {
    // This hyphenates the property internally:
    // https://github.com/robinweser/css-in-js-utils/blob/master/modules/cssifyDeclaration.js
    return cssifyDeclaration(property, value);
  }

  /**
   * Format an object of property value pairs into a CSS declartion block,
   * without wrapping brackets.
   */
  protected formatDeclarationBlock(properties: Properties): string {
    const props = Object.keys(properties);
    let block = '';

    for (let i = 0; i < props.length; i += 1) {
      const prop = props[i] as Property;

      block += this.formatDeclaration(prop, applyUnitToValue(prop, properties[prop]!));
      block += '; ';
    }

    return block.trim();
  }

  /**
   * Format a property value pair into a full CSS rule with brackets and class name.
   * If a selector or at-rule condition is defined, apply them as well.
   */
  protected formatRule(
    className: ClassName,
    property: string,
    value: string,
    params: StyleParams,
  ): string {
    let rule = `.${className}`;

    if (params.selector) {
      rule += params.selector;
    }

    rule += ` { ${this.formatDeclaration(property, value)} } `;

    if (params.condition) {
      rule = `${params.condition} { ${rule.trim()} } `;
    }

    return rule;
  }

  /**
   * Enqueue an at-rule to be rendered into the global style sheet.
   */
  protected enqueueAtRule(selector: string, body: string, callback?: QueueItem['callback']) {
    let rule = selector;

    if (selector === '@charset' || selector === '@import') {
      rule += ` ${body};`;
    } else {
      rule += ` { ${body} }`;
    }

    this.ruleBuffer.push({
      callback,
      rule,
      type: 'global',
    });

    if (!this.frameTimer) {
      this.frameTimer = window.requestAnimationFrame(this.flushBufferedRules);
    }

    if (process.env.NODE_ENV === 'test') {
      this.flushedStyles += rule;
    }
  }

  /**
   * Enqueue a standard CSS rule to be rendered into a style sheet.
   */
  protected enqueueRule(rule: string, type: SheetType, callback?: QueueItem['callback']) {
    this.ruleBuffer.push({
      callback,
      rule,
      type,
    });

    if (!this.frameTimer) {
      this.frameTimer = window.requestAnimationFrame(this.flushBufferedRules);
    }

    if (process.env.NODE_ENV === 'test') {
      this.flushedStyles += rule;
    }
  }

  /**
   * Flush all queued styles into the document.
   */
  protected flushBufferedRules = () => {
    const queue = [...this.ruleBuffer];

    // Reset state immediately in case another animation frame fires
    this.frameTimer = 0;
    this.ruleBuffer = [];

    // Loop through and inject the rule into the style sheet
    for (let i = 0; i < queue.length; i += 1) {
      const { callback, rule, type } = queue[i];
      const sheet = getDocumentStyleSheet(type);
      const rank = sheet.cssRules.length;

      sheet.insertRule(rule, rank);

      if (typeof callback === 'function') {
        callback(rank);
      }
    }
  };
}
