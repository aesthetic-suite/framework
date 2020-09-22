/* eslint-disable no-console */

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
import { hyphenate, isObject, objectLoop, objectReduce, generateHash } from '@aesthetic/utils';
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
import SheetManager from './SheetManager';
import { Condition, ProcessOptions, RenderOptions, API, RankCache } from './types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

function persistRank(ranks: RankCache | undefined, property: string, rank: number) {
  if (ranks && (ranks[property] === undefined || rank > ranks[property])) {
    ranks[property] = rank;
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
  api: API;

  cache = new AtomicCache();

  ruleCache: Record<string, ClassName | boolean> = {};

  ruleIndex: number = -1;

  abstract sheetManager: SheetManager;

  constructor(api: Partial<API> = {}) {
    this.api = {
      direction: 'ltr',
      ...api,
    };
  }

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
    options: RenderOptions = {},
  ): ClassName {
    const { direction, converter, prefixer } = this.api;

    // Hyphenate and cast values so they're deterministic
    let key = hyphenate(property);
    let val = processValue(key, value, options.unit);

    if (converter) {
      ({ key, value: val } = converter.convert(direction, options.direction || 'ltr', key, val));
    }

    // Check the cache immediately
    const cache = this.cache.read(key, val, options, options.rankings?.[key]);

    if (cache) {
      persistRank(options.rankings, key, cache.rank);

      return cache.className!;
    }

    // Format and insert the rule
    const rule = formatRule(
      options.selector,
      processProperties({ [key]: val }, { vendor: options.vendor }, this.api),
    );

    const className =
      options.className ||
      (options.deterministic
        ? this.generateDeterministicClassName(rule, options.conditions)
        : this.generateClassName());

    const classRule = `.${className}${rule}`;

    // Persist the max ranking
    const rank = this.insertRule(
      options.selector && options.vendor && prefixer
        ? prefixer.prefixSelector(options.selector, classRule)
        : classRule,
      options,
    );

    persistRank(options.rankings, key, rank);

    // Write to cache
    this.cache.write(key, val, {
      className,
      conditions: options.conditions,
      rank,
      selector: options.selector,
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
        this.api,
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
        `${step} { ${formatDeclarationBlock(processProperties(keyframe!, options, this.api))} } `,
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
      processProperties(nextProperties, options, this.api),
      cssVariables,
    );

    const hash = this.generateDeterministicClassName(rule, options.conditions);
    const className =
      options.className || (options.deterministic ? hash : this.generateClassName());

    // Insert once and cache separately than atomic class names
    if (!this.ruleCache[hash]) {
      const classRule = `.${className}${rule}`;
      const { prefixer } = this.api;

      this.insertRule(
        options.selector && options.vendor && prefixer
          ? prefixer.prefixSelector(options.selector, classRule)
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
      this.sheetManager.insertRule('global', rule);
      this.ruleCache[hash] = true;
    }
  }

  /**
   * Insert a CSS rule into 1 of the 3 style sheets.
   */
  protected insertRule(rule: string, options: RenderOptions): number {
    return this.sheetManager.insertRule(options.type || 'standard', rule, options.conditions);
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
          conditions.push(prop);
          classNames.add(onNestedRule(value, { ...options, conditions }));

          // Supports condition
        } else if (isSupportsRule(prop)) {
          conditions.push(prop);
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
