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
  CacheParams,
} from './types';
import applyUnitToValue from './applyUnitToValue';
import generateHash from './generateHash';
import isMediaQueryCondition from './isMediaQueryCondition';
import isSupportsCondition from './isSupportsCondition';
import isNestedSelector from './isNestedSelector';
import quoteString from './quoteString';
import GlobalStyleSheet from './GlobalStyleSheet';
import MediaStyleSheet from './MediaStyleSheet';
import StandardStyleSheet from './StandardStyleSheet';

export interface QueueItem {
  callback?: (rank: number) => void;
  rule: string;
  type: SheetType;
}

export default class Renderer {
  // Testing purposes only
  flushedStyles: string = '';

  protected classNameCache = new AtomicCache();

  protected globalStyleSheet = new GlobalStyleSheet();

  protected mediaStyleSheet = new MediaStyleSheet();

  protected standardStyleSheet = new StandardStyleSheet();

  /**
   * Generate a unique and deterministic class name for a property value pair.
   */
  generateClassName(property: string, value: string, params: StyleParams): string {
    return generateHash(
      `${params.conditions?.join('') || ''}${params.selector || ''}${property}${value}`,
    );
  }

  /**
   * Render a property value pair into the defined style sheet as a single class name.
   */
  renderDeclaration<K extends Property>(
    property: K,
    value: Properties[K],
    params: StyleParams = {},
    cacheParams: CacheParams = {},
  ) {
    // Hyphenate early so all checks are deterministic
    const prop = hyphenateProperty(property);

    // Apply unit as well so that "0" and "0px" do not generate separate classes
    const val = applyUnitToValue(property, value as Value);

    // Check the cache immediately
    const cache = cacheParams.bypassCache
      ? null
      : this.classNameCache.read(prop, val, params, cacheParams);

    if (cache) {
      return cache.className;
    }

    const className = this.generateClassName(prop, val, params);
    const rank = this.insertRule(
      this.formatRule(className, prop, val, params),
      params.type || 'standard',
    );

    this.classNameCache.write(prop, val, {
      conditions: [],
      selector: '',
      type: 'standard',
      ...params,
      className,
      rank,
    });

    return className;
  }

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace(fontFace: FontFace): string {
    if (__DEV__) {
      if (!fontFace.fontFamily) {
        throw new Error('Font faces require a font family.');
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
   * Render an `@import` to the global style sheet.
   */
  renderImport(value: string) {
    const path = value.slice(-1) === ';' ? value.slice(0, -1) : value;

    this.renderAtRule('@import', path);
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
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  // eslint-disable-next-line complexity
  renderRule(properties: Properties, params: StyleParams = {}): ClassName {
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
          const { conditions } = params;

          classNames += this.renderRule(value, {
            ...params,
            conditions: conditions ? [prop as string, ...conditions] : [prop as string],
          });
          classNames += ' ';

          // [attribute], :pseudo, > div
        } else if (isNestedSelector(prop)) {
          classNames += this.renderRule(value, { ...params, selector: prop });
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

  // renderRuleSets<T extends { [set: string]: Properties }>(sets: T, inOrder?: T[]) {
  //   const order = inOrder ?? ((Object.keys(sets) as unknown) as T[]);
  // }

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

    if (params.conditions) {
      params.conditions.forEach(condition => {
        rule = `${condition} { ${rule.trim()} } `;
      });
    }

    return rule;
  }

  /**
   * Insert an at-rule into the global style sheet.
   */
  protected insertAtRule(selector: string, properties: string | Properties) {
    const body =
      typeof properties === 'string' ? properties : this.formatDeclarationBlock(properties);
    let rule = selector;

    if (selector === '@import') {
      rule += ` ${body};`;
    } else {
      rule += ` { ${body} }`;
    }

    this.insertRule(rule, 'global');
  }

  /**
   * Insert a CSS rule into a specific style sheet.
   */
  protected insertRule(rule: string, type: SheetType, condition?: string): number {
    if (process.env.NODE_ENV === 'test') {
      this.flushedStyles += rule;
    }

    switch (type) {
      case 'global':
        return this.globalStyleSheet.insertRule(rule);
      case 'media':
        return this.mediaStyleSheet.insertRule(condition!, rule);
      default:
        return this.standardStyleSheet.insertRule(rule);
    }
  }
}
