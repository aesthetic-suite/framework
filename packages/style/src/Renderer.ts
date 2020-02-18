/* eslint-disable no-console, no-magic-numbers */

import { isObject } from 'aesthetic-utils';
import { hyphenateProperty } from 'css-in-js-utils';
import AtomicCache from './AtomicCache';
import applyUnitToValue from './helpers/applyUnitToValue';
import formatAtomicRule from './helpers/formatAtomicRule';
import formatDeclarationBlock from './helpers/formatDeclarationBlock';
import generateHash from './helpers/generateHash';
import isMediaQueryCondition from './helpers/isMediaQueryCondition';
import isSupportsCondition from './helpers/isSupportsCondition';
import isNestedSelector from './helpers/isNestedSelector';
import isInvalidValue from './helpers/isInvalidValue';
import GlobalStyleSheet from './GlobalStyleSheet';
import ConditionsStyleSheet from './ConditionsStyleSheet';
import StandardStyleSheet from './StandardStyleSheet';
import {
  Block,
  CacheParams,
  ClassName,
  FontFace,
  Keyframes,
  Properties,
  Property,
  StyleParams,
  Value,
  StyleRule,
  SheetType,
  CSSVariables,
} from './types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

export default abstract class Renderer {
  protected atRuleCache: { [hash: string]: boolean } = {};

  protected classNameCache = new AtomicCache();

  protected ruleIndex = 0;

  protected abstract globalStyleSheet: GlobalStyleSheet;

  protected abstract conditionsStyleSheet: ConditionsStyleSheet;

  protected abstract standardStyleSheet: StandardStyleSheet;

  /**
   * Generate a unique and deterministic class name for a property value pair.
   */
  generateClassName(): string {
    const index = this.ruleIndex;

    if (index < CHARS_LENGTH) {
      return CHARS[index];
    }

    return CHARS[index % CHARS_LENGTH] + Math.floor(index / CHARS_LENGTH);
  }

  /**
   * Return the root style rule for the defined style sheet.
   */
  getRootRule(type: SheetType): StyleRule {
    if (type === 'global') {
      return this.globalStyleSheet.sheet;
    }

    if (type === 'conditions') {
      return this.conditionsStyleSheet.sheet;
    }

    return this.standardStyleSheet.sheet;
  }

  /**
   * Render a property value pair into the defined style sheet as a single class name.
   */
  renderDeclaration<K extends Property>(
    property: K,
    value: Properties[K],
    { conditions = [], selector = '', type = 'standard' }: StyleParams = {},
    { bypassCache = false, minimumRank }: CacheParams = {},
  ) {
    const params = { conditions, selector, type };

    // Hyphenate early so all checks are deterministic
    const prop = hyphenateProperty(property);

    // Apply unit as well so that "0" and "0px" do not generate separate classes
    const val = applyUnitToValue(property, value as Value);

    // Check the cache immediately
    const cache = this.classNameCache.read(prop, val, params, minimumRank);

    if (cache && !bypassCache) {
      return cache.className;
    }

    const className = this.generateClassName();
    const rank = this.insertRule(
      formatAtomicRule(className, property, val, params.selector),
      params,
    );

    this.ruleIndex += 1;
    this.classNameCache.write(prop, val, {
      className,
      conditions,
      rank,
      selector,
      type,
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
      frames += `${steps[i]} { ${formatDeclarationBlock(keyframes[steps[i]]!)} }`;
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

  /**
   * Render a mapping of multiple rule sets in the defined order.
   * If no order is provided, they will be rendered sequentially.
   */
  renderRuleSets<T extends { [set: string]: Block }>(sets: T, inOrder?: (keyof T)[]) {
    const order = inOrder ?? Object.keys(sets);
    let className = '';

    for (let i = 0; i < order.length; i += 1) {
      className += this.renderRule(sets[order[i]]);
      className += ' ';
    }

    return className.trim();
  }

  /**
   * Insert an at-rule into the global style sheet.
   */
  protected insertAtRule(selector: string, properties: string | Properties) {
    const body = typeof properties === 'string' ? properties : formatDeclarationBlock(properties);
    let rule = selector;

    if (selector === '@import') {
      rule += ` ${body};`;
    } else {
      rule += ` { ${body} }`;
    }

    const hash = generateHash(rule);

    // Only insert it once
    if (!this.atRuleCache[hash]) {
      this.insertRule(rule, { type: 'global' });
      this.atRuleCache[hash] = true;
    }
  }

  /**
   * Insert a CSS rule into 1 of the 3 style sheets.
   */
  protected insertRule(rule: string, params: StyleParams): number {
    const { conditions = [], type } = params;

    if (type === 'global') {
      return this.globalStyleSheet.insertRule(rule);
    }

    // Insert into the conditional style sheet if conditions exist
    if (type === 'conditions' || conditions.length > 0) {
      return this.conditionsStyleSheet.insertRule(conditions, rule);
    }

    // No media or feature queries so insert into the standard style sheet
    return this.standardStyleSheet.insertRule(rule);
  }

  /**
   * Apply CSS variables to the :root declaration.
   */
  abstract applyRootVariables(vars: CSSVariables): void;
}
