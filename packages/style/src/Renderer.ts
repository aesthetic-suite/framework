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
  Value,
} from '@aesthetic/types';
import { hyphenate, isObject, objectLoop, objectReduce, generateHash } from '@aesthetic/utils';
import Cache from './Cache';
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
import { ProcessOptions, RenderOptions, API, CacheItem } from './types';
import createAtomicCacheKey from './helpers/createAtomicCacheKey';
import { formatVariableName } from './helpers';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      AESTHETIC_CUSTOM_RENDERER?: Renderer;
    }
  }
}

export default abstract class Renderer {
  api: API;

  cache = new Cache();

  ruleIndex: number = -1;

  abstract sheetManager: SheetManager;

  constructor(api: Partial<API> = {}) {
    this.api = {
      direction: 'ltr',
      ...api,
    };
  }

  /**
   * Generate an incremental or deterministic class name.
   */
  generateClassName(rule: string, options: RenderOptions = {}): ClassName {
    if (options.deterministic) {
      const hash = generateHash(formatConditions(rule, options.conditions));

      // Avoid hashes that start with an invalid number
      return `c${hash}`;
    }

    this.ruleIndex += 1;

    const index = this.ruleIndex;

    if (index < CHARS_LENGTH) {
      return CHARS[index];
    }

    return CHARS[index % CHARS_LENGTH] + Math.floor(index / CHARS_LENGTH);
  }

  /**
   * Render a property value pair into the defined style sheet as a single class name.
   */
  renderDeclaration<K extends Property>(
    property: K,
    value: Properties[K],
    options: RenderOptions = {},
  ): ClassName {
    const { rankings } = options;

    const key = hyphenate(property);
    const val = processValue(key, value, options.unit);

    // Render and cache rule against the defined rank
    const { className, rank } = this.doRender({ [key]: val }, undefined, {
      ...options,
      // We've converted above, so avoid converting again
      direction: undefined,
      // Pass the latest rank for specificity guarding
      minimumRank: rankings?.[key],
    });

    // Persist the rank for each render
    if (rankings && rank && (rankings[property] === undefined || rank > rankings[property])) {
      rankings[property] = rank;
    }

    return className;
  }

  /**
   * Render a `@font-face` to the global style sheet and return the font family name.
   */
  renderFontFace(fontFace: FontFace, options: ProcessOptions = {}): string {
    if (!fontFace.fontFamily) {
      fontFace.fontFamily = `ff${generateHash(
        formatDeclarationBlock(fontFace as GenericProperties),
      )}`;
    }

    this.insertAtRule('@font-face', processProperties(fontFace as Properties, options, this.api));

    return fontFace.fontFamily;
  }

  /**
   * Render an `@import` to the global style sheet.
   */
  renderImport(value: string) {
    this.insertAtRule('@import', value.slice(-1) === ';' ? value.slice(0, -1) : value);
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

    // Always use deterministic classes for grouped rules so we avoid subsequent renders
    options.deterministic = true;

    // Insert rule styles only once
    const { className } = this.doRender(nextProperties, cssVariables, options);

    // Render all nested rules with the parent class name
    this.processRule(nestedRules, { ...options, className }, this.renderRuleGrouped);

    return className;
  };

  /**
   * Render an element level CSS variable into the defined style sheet as a single class name.
   */
  renderVariable(name: string, value: Value, options: RenderOptions = {}): ClassName {
    return this.doRender(undefined, { [formatVariableName(name)]: value }, options).className;
  }

  /**
   * Utility method for handling the caching process.
   */
  protected doCache(key: string, run: () => CacheItem, minimumRank?: number): CacheItem {
    let cache = this.cache.read(key, minimumRank);

    if (!cache) {
      cache = run();
      this.cache.write(key, cache);
    }

    return cache;
  }

  /**
   * Utility method for rendering properties/variables into a CSS rule.
   */
  protected doRender(
    properties: Properties | undefined,
    variables: Variables | undefined,
    options: RenderOptions,
  ): CacheItem {
    const { prefixer } = this.api;

    // Format objects into a CSS string (without class name)
    const rule = formatRule({
      properties: properties ? processProperties(properties, options, this.api) : undefined,
      selector: options.selector,
      variables,
    });

    return this.doCache(
      createAtomicCacheKey(rule, options),
      () => {
        // Generate class name and format CSS rule (with class name)
        const className = options.className || this.generateClassName(rule, options);
        const css = `.${className}${rule}`;

        // Insert rule and return a rank
        const rank = this.insertRule(
          options.selector && options.vendor && prefixer
            ? prefixer.prefixSelector(options.selector, css)
            : css,
          options,
        );

        return {
          className,
          rank,
        };
      },
      options.minimumRank,
    );
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

    const className = this.generateClassName(rule, { deterministic: true });

    // Insert at-rule only once
    this.doCache(className, () => {
      this.sheetManager.insertRule('global', rule);

      return { className };
    });
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

        // CSS variables
      } else if (isVariable(prop)) {
        classNames.add(this.renderVariable(prop, value!, options));

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
