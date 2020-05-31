/* eslint-disable no-console, no-magic-numbers */

import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';
import {
  arrayReduce,
  hyphenate,
  isObject,
  objectLoop,
  objectReduce,
  generateHash,
} from '@aesthetic/utils';
import AtomicCache from './AtomicCache';
import formatConditions from './helpers/formatConditions';
import formatDeclarationBlock from './helpers/formatDeclarationBlock';
import formatRule from './helpers/formatRule';
import isMediaRule from './helpers/isMediaRule';
import isSupportsRule from './helpers/isSupportsRule';
import isNestedSelector from './helpers/isNestedSelector';
import isInvalidValue from './helpers/isInvalidValue';
import isVariable from './helpers/isVariable';
import processProperties from './helpers/processProperties';
import GlobalStyleSheet from './GlobalStyleSheet';
import ConditionsStyleSheet from './ConditionsStyleSheet';
import StandardStyleSheet from './StandardStyleSheet';
import { MEDIA_RULE, SUPPORTS_RULE } from './constants';
import {
  ClassName,
  Condition,
  CSSVariables,
  FontFace,
  GenericProperties,
  Keyframes,
  ProcessParams,
  Properties,
  Property,
  Rule,
  SheetType,
  RenderParams,
  StyleRule,
} from './types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

function createDefaultParams(params: RenderParams): Required<RenderParams> {
  return {
    className: '',
    conditions: [],
    deterministic: false,
    prefix: false,
    rankings: {},
    rtl: false,
    selector: '',
    type: 'standard',
    ...params,
  };
}

function persistRank(params: Required<RenderParams>, property: string, rank: number) {
  if (params.rankings[property] === undefined || rank > params.rankings[property]) {
    params.rankings[property] = rank;
  }
}

export default abstract class Renderer {
  readonly classNameCache = new AtomicCache();

  readonly ruleCache: { [hash: string]: ClassName | boolean } = {};

  ruleIndex: number = -1;

  abstract globalStyleSheet: GlobalStyleSheet;

  abstract conditionsStyleSheet: ConditionsStyleSheet;

  abstract standardStyleSheet: StandardStyleSheet;

  /**
   * Generate an incremental class name.
   */
  generateClassName(): ClassName {
    this.ruleIndex += 1;

    const index = this.ruleIndex;

    if (index < CHARS_LENGTH) {
      return CHARS[index];
    }

    return CHARS[index % CHARS_LENGTH] + Math.floor(index / CHARS_LENGTH);
  }

  /**
   * Generate a deterministic class name based on the provided rule (without class name).
   */
  generateDeterministicClassName(rule: string, conditions: Condition[] = []): ClassName {
    const hash = generateHash(formatConditions(rule, conditions));

    // Avoid hashes that start with an invalid number
    return `c${hash}`;
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
    baseParams: RenderParams = {},
  ) {
    const params = createDefaultParams(baseParams);

    // Hyphenate and cast values so they're deterministic
    let key = hyphenate(property);
    let val = String(value);

    if (params.rtl) {
      key = getPropertyDoppelganger(key);
      val = getValueDoppelganger(key, val);
    }

    // Check the cache immediately
    const cache = this.classNameCache.read(key, val, params, params.rankings[key]);

    if (cache) {
      persistRank(params, key, cache.rank);

      return cache.className;
    }

    // Format and insert the rule
    const rule = formatRule(
      params.selector,
      processProperties({ [key]: val }, { prefix: params.prefix }),
    );

    const className =
      params.className ||
      (params.deterministic
        ? this.generateDeterministicClassName(rule, params.conditions)
        : this.generateClassName());

    // Persist the max ranking
    const rank = this.insertRule(`.${className}${rule}`, params);

    persistRank(params, key, rank);

    // Write to cache
    this.classNameCache.write(key, val, {
      className,
      conditions: params.conditions,
      rank,
      selector: params.selector,
      type: params.type,
    });

    return className;
  }

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace(fontFace: FontFace, params: ProcessParams = {}): string {
    if (__DEV__) {
      if (!fontFace.fontFamily) {
        throw new Error('Font faces require a font family.');
      }
    }

    this.insertAtRule('@font-face', processProperties(fontFace as Properties, params));

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
  renderKeyframes(
    keyframes: Keyframes,
    customName: string = '',
    params: ProcessParams = {},
  ): string {
    const rule = objectReduce(
      keyframes,
      (keyframe, step) =>
        `${step} { ${formatDeclarationBlock(processProperties(keyframe!, params))} } `,
    );

    const animationName = customName || `kf${generateHash(rule)}`;

    this.insertAtRule(`@keyframes ${animationName}`, rule);

    return animationName;
  }

  /**
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  renderRule = (properties: Rule, params: RenderParams = {}): ClassName => {
    return this.processRule(properties, params, this.renderRule, true);
  };

  /**
   * Render an object of property value pairs into the defined style sheet as a single class name,
   * with all properties grouped within.
   */
  renderRuleGrouped = (properties: Rule, params: RenderParams = {}): ClassName => {
    const nestedRules: { [selector: string]: Rule } = {};
    const cssVariables: CSSVariables = {};
    const nextProperties: GenericProperties = {};

    // Extract all nested rules first as we need to process them *after* properties
    objectLoop<Rule, Property>(properties, (value, prop) => {
      if (isInvalidValue(value)) {
        // Skip
      } else if (isObject(value)) {
        nestedRules[prop] = value;
      } else if (isVariable(prop)) {
        cssVariables[prop] = value!;
      } else {
        nextProperties[prop] = value!;
      }
    });

    const rule = formatRule(
      params.selector,
      processProperties(nextProperties, params),
      cssVariables,
    );

    const hash = this.generateDeterministicClassName(rule, params.conditions);
    const className = params.className || (params.deterministic ? hash : this.generateClassName());

    // Insert once and cache separately than atomic class names
    if (!this.ruleCache[hash]) {
      this.insertRule(`.${className}${rule}`, params);
      this.ruleCache[hash] = className;
    }

    // Render all nested rules with the top-level class name
    this.processRule(nestedRules, { ...params, className }, this.renderRuleGrouped);

    return className;
  };

  /**
   * Render a mapping of multiple rule sets in the defined order.
   * If no order is provided, they will be rendered sequentially.
   */
  renderRuleSets<T extends { [set: string]: Rule }>(
    sets: T,
    inOrder?: (keyof T)[],
    params?: RenderParams,
  ) {
    const order = inOrder ?? Object.keys(sets);

    return arrayReduce(order, (key) => `${this.renderRule(sets[key], params)} `).trim();
  }

  /**
   * Insert an at-rule into the global style sheet.
   */
  protected insertAtRule(selector: string, properties: string | Properties) {
    const body =
      typeof properties === 'string'
        ? properties
        : formatDeclarationBlock(properties as GenericProperties);
    let rule = selector;

    if (selector === '@import') {
      rule += ` ${body};`;
    } else {
      rule += ` { ${body} }`;
    }

    const hash = this.generateDeterministicClassName(rule);

    // Only insert it once
    if (!this.ruleCache[hash]) {
      this.insertRule(rule, { type: 'global' });
      this.ruleCache[hash] = true;
    }
  }

  /**
   * Insert a CSS rule into 1 of the 3 style sheets.
   */
  protected insertRule(rule: string, params: RenderParams): number {
    const { conditions = [], type = 'standard' } = params;

    if (type === 'global') {
      return this.globalStyleSheet.insertRule(rule);
    }

    // Insert into the conditional style sheet if conditions exist
    if (type === 'conditions' || conditions.length > 0) {
      return this.conditionsStyleSheet.insertRule(rule, conditions);
    }

    // No media or feature queries so insert into the standard style sheet
    return this.standardStyleSheet.insertRule(rule);
  }

  /**
   * Process a rule block with the defined params and processors.
   */
  protected processRule(
    rule: Rule,
    params: RenderParams,
    onNestedRule: (properties: Rule, params: RenderParams) => ClassName,
    processProperty: boolean = false,
  ) {
    const classNames = new Set<string>();

    objectLoop<Rule, Property>(rule, (value, prop) => {
      // Skip invalid values
      if (isInvalidValue(value)) {
        if (__DEV__) {
          console.warn(`Invalid value "${value}" for property "${prop}".`);
        }

        // Handle nested selectors and objects
      } else if (isObject(value)) {
        const { conditions = [] } = params;

        // Media condition
        if (isMediaRule(prop)) {
          conditions.push({
            query: prop.slice(6).trim(),
            type: MEDIA_RULE,
          });

          classNames.add(onNestedRule(value, { ...params, conditions }));

          // Supports condition
        } else if (isSupportsRule(prop)) {
          conditions.push({
            query: prop.slice(9).trim(),
            type: SUPPORTS_RULE,
          });

          classNames.add(onNestedRule(value, { ...params, conditions }));

          // Selectors
        } else if (isNestedSelector(prop)) {
          classNames.add(onNestedRule(value, { ...params, selector: prop }));

          // Unknown
        } else if (__DEV__) {
          console.warn(`Unknown property selector or nested block "${prop}".`);
        }

        // Handle CSS variables
      } else if (isVariable(prop)) {
        if (__DEV__) {
          console.warn(
            `CSS variables are only accepted within rule groups. Found "${prop}" variable.`,
          );
        }

        // Property value pair
      } else if (processProperty) {
        classNames.add(this.renderDeclaration(prop, value, params));
      }
    });

    return Array.from(classNames).join(' ');
  }

  /**
   * Apply CSS variables to the :root declaration.
   */
  abstract applyRootVariables(vars: CSSVariables): void;
}
