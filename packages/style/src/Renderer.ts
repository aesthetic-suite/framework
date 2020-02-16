/* eslint-disable no-console, no-magic-numbers */

import { isObject } from 'aesthetic-utils';
import { cssifyDeclaration, hyphenateProperty } from 'css-in-js-utils';
import AtomicCache from './AtomicCache';
import {
  Block,
  CacheItem,
  CacheParams,
  ClassName,
  FontFace,
  Keyframes,
  Properties,
  Property,
  StyleParams,
  Value,
} from './types';
import applyUnitToValue from './helpers/applyUnitToValue';
import generateHash from './helpers/generateHash';
import isMediaQueryCondition from './helpers/isMediaQueryCondition';
import isSupportsCondition from './helpers/isSupportsCondition';
import isNestedSelector from './helpers/isNestedSelector';
import GlobalStyleSheet from './GlobalStyleSheet';
import ConditionsStyleSheet from './ConditionsStyleSheet';
import StandardStyleSheet from './StandardStyleSheet';
import isInvalidValue from './helpers/isInvalidValue';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

export default class Renderer {
  protected atRuleCache: { [hash: string]: boolean } = {};

  protected classNameCache = new AtomicCache();

  protected globalStyleSheet = new GlobalStyleSheet();

  protected conditionsStyleSheet = new ConditionsStyleSheet();

  protected ruleIndex = 0;

  protected standardStyleSheet = new StandardStyleSheet();

  /**
   * Generate a unique and deterministic class name for a property value pair.
   */
  generateClassName(): string {
    const index = this.ruleIndex;

    if (index < CHARS_LENGTH) {
      return CHARS[index];
    }

    return CHARS[index % CHARS_LENGTH] + Math.floor(index / CHARS_LENGTH);

    // return generateHash(
    //   `${params.conditions?.map(c => c.query) || ''}${params.selector || ''}${property}${value}`,
    // );
  }

  /**
   * Render a property value pair into the defined style sheet as a single class name.
   */
  renderDeclaration<K extends Property>(
    property: K,
    value: Properties[K],
    params: StyleParams = {},
    { bypassCache = false }: CacheParams = {},
  ) {
    // Hyphenate early so all checks are deterministic
    const prop = hyphenateProperty(property);

    // Apply unit as well so that "0" and "0px" do not generate separate classes
    const val = applyUnitToValue(property, value as Value);

    // Check the cache immediately
    const cache = this.classNameCache.read(prop, val, params);

    if (cache && !bypassCache) {
      return cache.className;
    }

    const className = this.generateClassName();
    const rank = this.insertRule(className, prop, val, params);
    const item: CacheItem = {
      conditions: [],
      selector: '',
      type: 'standard',
      ...params,
      className,
      rank,
    };

    this.classNameCache.write(prop, val, item);
    this.ruleIndex += 1;

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

    this.insertAtRule('@font-face', fontFace as Properties);

    return fontFace.fontFamily;
  }

  /**
   * Render an `@import` to the global style sheet.
   */
  renderImport(value: string) {
    const path = value.slice(-1) === ';' ? value.slice(0, -1) : value;

    this.insertAtRule('@import', path);
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

    this.insertAtRule(`@keyframes ${animationName}`, frames);

    return animationName;
  }

  /**
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  // eslint-disable-next-line complexity
  renderRule(properties: Block, params: StyleParams = {}): ClassName {
    const props = Object.keys(properties);
    let classNames = '';

    for (let i = 0; i < props.length; i += 1) {
      const prop = props[i] as Property;
      const value = properties[prop];

      // Skip invalid values
      if (isInvalidValue(value)) {
        if (__DEV__) {
          console.warn(`Invalid value "${value}" for property "${prop}".`);
        }

        // Handle nested selectors and objects
      } else if (isObject(value)) {
        const { conditions = [] } = params;

        // @media
        if (isMediaQueryCondition(prop)) {
          conditions.push({
            query: prop.slice(6).trim(),
            type: CSSRule.MEDIA_RULE,
          });

          classNames += this.renderRule(value, { ...params, conditions });

          // @supports
        } else if (isSupportsCondition(prop)) {
          conditions.push({
            query: prop.slice(9).trim(),
            type: CSSRule.SUPPORTS_RULE,
          });

          classNames += this.renderRule(value, { ...params, conditions });

          // [attribute], :pseudo, > div
        } else if (isNestedSelector(prop)) {
          classNames += this.renderRule(value, { ...params, selector: prop });

          // Unknown
        } else if (__DEV__) {
          console.warn(`Unknown property selector or nested block "${prop}".`);
        }

        // Property value pair
      } else {
        classNames += this.renderDeclaration(prop as Property, value, params);
      }

      classNames += ' ';
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
    selector?: string,
  ): string {
    return `.${className}${selector || ''} { ${this.formatDeclaration(property, value)} }`;
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

    const hash = generateHash(rule);

    // Only insert it once
    if (!this.atRuleCache[hash]) {
      this.globalStyleSheet.insertRule(rule);
      this.atRuleCache[hash] = true;
    }
  }

  /**
   * Insert a CSS rule into either the standard or conditional style sheet.
   */
  protected insertRule(
    className: ClassName,
    property: string,
    value: string,
    params: StyleParams,
  ): number {
    const { conditions = [] } = params;
    const rule = this.formatRule(className, property, value, params.selector);

    // No media or feature queries so insert into the standard style sheet
    if (conditions.length === 0) {
      return this.standardStyleSheet.insertRule(rule);
    }

    // Otherwise insert into the conditional style sheet
    return this.conditionsStyleSheet.insertRule(conditions, rule);
  }
}
