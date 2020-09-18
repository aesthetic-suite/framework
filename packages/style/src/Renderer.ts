/* eslint-disable no-console, no-magic-numbers */

import { getPropertyDoppelganger, getValueDoppelganger } from 'rtl-css-js/core';
import {
  ClassName,
  FontFace,
  Keyframes,
  Property,
  Properties,
  GenericProperties,
  Variables,
  Rule,
} from '@aesthetic/types';
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
import processValue from './helpers/processValue';
import StyleSheet from './StyleSheet';
import ConditionsStyleSheet from './ConditionsStyleSheet';
import { MEDIA_RULE, SUPPORTS_RULE } from './constants';
import { Condition, ProcessOptions, SheetType, RenderOptions, StyleRule } from './types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

function createDefaultOptions(options: RenderOptions): Required<RenderOptions> {
  return {
    className: '',
    conditions: [],
    deterministic: false,
    rankings: {},
    rtl: false,
    selector: '',
    type: 'standard',
    unit: 'px',
    vendor: null,
    ...options,
  };
}

function persistRank(options: Required<RenderOptions>, property: string, rank: number) {
  if (options.rankings[property] === undefined || rank > options.rankings[property]) {
    options.rankings[property] = rank;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      AESTHETIC_CUSTOM_RENDERER: Renderer;
    }
  }
}

export default abstract class Renderer {
  readonly classNameCache = new AtomicCache();

  readonly ruleCache: Record<string, ClassName | boolean> = {};

  ruleIndex: number = -1;

  abstract globalStyleSheet: StyleSheet;

  abstract conditionsStyleSheet: ConditionsStyleSheet;

  abstract standardStyleSheet: StyleSheet;

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
   * Render a property value pair into the defined style sheet as a single class name.
   */
  renderDeclaration<K extends Property>(
    property: K,
    value: Properties[K],
    opts: RenderOptions = {},
  ): ClassName {
    const options = createDefaultOptions(opts);

    // Hyphenate and cast values so they're deterministic
    let key = hyphenate(property);
    let val = processValue(key, value, opts.unit);

    if (options.rtl) {
      key = getPropertyDoppelganger(key);
      val = getValueDoppelganger(key, val);
    }

    // Check the cache immediately
    const cache = this.classNameCache.read(key, val, options, options.rankings[key]);

    if (cache) {
      persistRank(options, key, cache.rank);

      return cache.className;
    }

    // Format and insert the rule
    const rule = formatRule(
      options.selector,
      processProperties({ [key]: val }, { vendor: options.vendor }),
    );

    const className =
      options.className ||
      (options.deterministic
        ? this.generateDeterministicClassName(rule, options.conditions)
        : this.generateClassName());

    const classRule = `.${className}${rule}`;

    // Persist the max ranking
    const rank = this.insertRule(
      options.selector && options.vendor
        ? options.vendor.prefixSelector(options.selector, classRule)
        : classRule,
      options,
    );

    persistRank(options, key, rank);

    // Write to cache
    this.classNameCache.write(key, val, {
      className,
      conditions: options.conditions,
      rank,
      selector: options.selector,
      type: options.type,
    });

    return className;
  }

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace(fontFace: FontFace, options: ProcessOptions = {}): string {
    const fontFamily =
      fontFace.fontFamily ||
      `ff${generateHash(formatDeclarationBlock(fontFace as GenericProperties))}`;

    this.insertAtRule(
      '@font-face',
      processProperties(
        {
          ...fontFace,
          fontFamily,
        } as Properties,
        options,
      ),
    );

    return fontFamily;
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
    options: ProcessOptions = {},
  ): string {
    const rule = objectReduce(
      keyframes,
      (keyframe, step) =>
        `${step} { ${formatDeclarationBlock(processProperties(keyframe!, options))} } `,
    );

    const animationName = customName || `kf${generateHash(rule)}`;

    this.insertAtRule(`@keyframes ${animationName}`, rule);

    return animationName;
  }

  /**
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  renderRule = (properties: Rule, options: RenderOptions = {}): ClassName => {
    return this.processRule(properties, options, this.renderRule, true);
  };

  /**
   * Render an object of property value pairs into the defined style sheet as a single class name,
   * with all properties grouped within.
   */
  renderRuleGrouped = (properties: Rule, options: RenderOptions = {}): ClassName => {
    const nestedRules: Record<string, Rule> = {};
    const cssVariables: Variables = {};
    const nextProperties: GenericProperties = {};

    // Extract all nested rules first as we need to process them *after* properties
    objectLoop<Rule, Property>(properties, (value, prop) => {
      if (isInvalidValue(value)) {
        // Skip
      } else if (isObject<Rule>(value)) {
        nestedRules[prop] = value;
      } else if (isVariable(prop)) {
        cssVariables[prop] = value!;
      } else {
        nextProperties[prop] = value!;
      }
    });

    const rule = formatRule(
      options.selector,
      processProperties(nextProperties, options),
      cssVariables,
    );

    const hash = this.generateDeterministicClassName(rule, options.conditions);
    const className =
      options.className || (options.deterministic ? hash : this.generateClassName());

    // Insert once and cache separately than atomic class names
    if (!this.ruleCache[hash]) {
      const classRule = `.${className}${rule}`;

      this.insertRule(
        options.selector && options.vendor
          ? options.vendor.prefixSelector(options.selector, classRule)
          : classRule,
        options,
      );

      this.ruleCache[hash] = className;
    }

    // Render all nested rules with the top-level class name
    this.processRule(nestedRules, { ...options, className }, this.renderRuleGrouped);

    return className;
  };

  /**
   * Render a mapping of multiple rules in the defined order.
   * If no order is provided, they will be rendered sequentially.
   */
  renderRulesOrdered<T extends Record<string, Rule>>(
    sets: T,
    inOrder?: (keyof T)[],
    options?: RenderOptions,
  ) {
    const order = inOrder ?? Object.keys(sets);

    return arrayReduce(order, (key) => `${this.renderRule(sets[key], options)} `).trim();
  }

  /**
   * Return the root style rule for the defined style sheet.
   */
  protected getRootRule(type: SheetType): StyleRule {
    if (type === 'global') {
      return this.globalStyleSheet.sheet;
    }

    if (type === 'conditions') {
      return this.conditionsStyleSheet.sheet;
    }

    return this.standardStyleSheet.sheet;
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
  protected insertRule(rule: string, options: RenderOptions): number {
    const { conditions = [], type = 'standard' } = options;

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
   * Process a rule block with the defined options and processors.
   */
  protected processRule(
    rule: Rule,
    options: RenderOptions,
    onNestedRule: (properties: Rule, options: RenderOptions) => ClassName,
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
      } else if (isObject<Rule>(value)) {
        const { conditions = [] } = options;

        // Media condition
        if (isMediaRule(prop)) {
          conditions.push({
            query: prop.slice(6).trim(),
            type: MEDIA_RULE,
          });

          classNames.add(onNestedRule(value, { ...options, conditions }));

          // Supports condition
        } else if (isSupportsRule(prop)) {
          conditions.push({
            query: prop.slice(9).trim(),
            type: SUPPORTS_RULE,
          });

          classNames.add(onNestedRule(value, { ...options, conditions }));

          // Selectors
        } else if (isNestedSelector(prop)) {
          classNames.add(onNestedRule(value, { ...options, selector: prop }));

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
        classNames.add(this.renderDeclaration(prop, value, options));
      }
    });

    return Array.from(classNames).join(' ');
  }

  /**
   * Apply CSS variables to the :root declaration.
   */
  abstract applyRootVariables(vars: Variables): void;
}
