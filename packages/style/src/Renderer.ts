/* eslint-disable no-console, no-magic-numbers, no-dupe-class-members, lines-between-class-members */

// @ts-ignore Not typed correctly
import { prefix } from 'inline-style-prefixer';
import {
  arrayReduce,
  hyphenate,
  isObject,
  objectLoop,
  objectReduce,
  generateHash,
} from '@aesthetic/utils';
import AtomicCache from './AtomicCache';
import isUnitlessProperty from './helpers/isUnitlessProperty';
import formatConditions from './helpers/formatConditions';
import formatDeclarationBlock from './helpers/formatDeclarationBlock';
import formatRule from './helpers/formatRule';
import isMediaRule from './helpers/isMediaRule';
import isSupportsRule from './helpers/isSupportsRule';
import isNestedSelector from './helpers/isNestedSelector';
import isInvalidValue from './helpers/isInvalidValue';
import GlobalStyleSheet from './GlobalStyleSheet';
import ConditionsStyleSheet from './ConditionsStyleSheet';
import StandardStyleSheet from './StandardStyleSheet';
import { MEDIA_RULE, SUPPORTS_RULE } from './constants';
import {
  Rule,
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
  RendererOptions,
  ProcessedProperties,
  Condition,
} from './types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

type OnProperty<K extends Property> = (
  property: K,
  value: Properties[K],
  params: StyleParams,
) => ClassName;
type OnNestedRule = (properties: Rule, params: StyleParams) => ClassName;

export default abstract class Renderer {
  ruleIndex = 0;

  readonly classNameCache = new AtomicCache();

  readonly options: Required<RendererOptions> = {
    deterministic: false,
    prefix: false,
    rtl: false,
    unit: 'px',
  };

  readonly ruleCache: { [hash: string]: ClassName | boolean } = {};

  protected abstract globalStyleSheet: GlobalStyleSheet;

  protected abstract conditionsStyleSheet: ConditionsStyleSheet;

  protected abstract standardStyleSheet: StandardStyleSheet;

  constructor(options: RendererOptions = {}) {
    Object.assign(this.options, options);
  }

  /**
   * Apply a unit suffix to a numeric value if the property requires one.
   */
  applyUnitToValue<K extends Property>(property: K, value: Properties[K]): string;
  applyUnitToValue(property: string, value: Value): string;
  applyUnitToValue(property: string, value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    if (isUnitlessProperty(property) || value === 0) {
      return String(value);
    }

    return value + this.options.unit;
  }

  /**
   * Generate an incremental class name.
   */
  generateClassName(): ClassName {
    const index = this.ruleIndex;

    this.ruleIndex += 1;

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
    {
      className: fixedClassName,
      conditions = [],
      selector = '',
      type = 'standard',
    }: StyleParams = {},
    { bypassCache = false, minimumRank }: CacheParams = {},
  ) {
    const params = { conditions, selector, type };

    // Hyphenate early so all checks are deterministic
    const prop = hyphenate(property);

    // Apply unit as well so that "0" and "0px" do not generate separate classes
    const val = this.applyUnitToValue(property, value);

    // Check the cache immediately
    const cache = this.classNameCache.read(prop, val, params, minimumRank);

    if (cache && !bypassCache) {
      return cache.className;
    }

    const block = { [prop]: val };
    const rule = formatRule(this.options.prefix ? prefix(block) : block, params.selector);
    const className =
      fixedClassName ||
      (this.options.deterministic
        ? this.generateDeterministicClassName(rule, params.conditions)
        : this.generateClassName());
    const rank = this.insertRule(`.${className}${rule}`, params);

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
    const rule = objectReduce(
      keyframes,
      (keyframe, step) =>
        `${step} { ${formatDeclarationBlock(this.processProperties(keyframe!))} } `,
    );

    // A bit more deterministic than a counter
    const animationName = customName || `kf${generateHash(rule)}`;

    this.insertAtRule(`@keyframes ${animationName}`, rule);

    return animationName;
  }

  /**
   * Render an object of property value pairs into the defined style sheet as multiple class names,
   * with each declaration resulting in a unique class name.
   */
  renderRule = (properties: Rule, params: StyleParams = {}): ClassName => {
    return this.processRule(properties, params, this.renderRule, true);
  };

  /**
   * Render an object of property value pairs into the defined style sheet as a single class name,
   * with all properties grouped within.
   */
  renderRuleGrouped = (properties: Rule, params: StyleParams = {}): ClassName => {
    const nestedRules: { [selector: string]: Rule } = {};
    const processedProperties: ProcessedProperties = {};

    // Extract all nested rules first as we need to process them *after* properties
    objectLoop<Rule, Property>(properties, (value, prop) => {
      if (isObject(value)) {
        nestedRules[prop] = value;
      } else if (!isInvalidValue(value)) {
        processedProperties[prop] = this.applyUnitToValue(prop, value);
      }
    });

    const rule = formatRule(
      this.options.prefix ? prefix(processedProperties) : processedProperties,
      params.selector,
    );
    const hash = this.generateDeterministicClassName(rule, params.conditions);
    const className =
      params.className || (this.options.deterministic ? hash : this.generateClassName());

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
  renderRuleSets<T extends { [set: string]: Rule }>(sets: T, inOrder?: (keyof T)[]) {
    const order = inOrder ?? Object.keys(sets);

    return arrayReduce(order, key => `${this.renderRule(sets[key])} `).trim();
  }

  /**
   * Insert an at-rule into the global style sheet.
   */
  protected insertAtRule(selector: string, properties: string | Properties) {
    const body =
      typeof properties === 'string'
        ? properties
        : formatDeclarationBlock(this.processProperties(properties));
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
  protected insertRule(rule: string, params: StyleParams): number {
    const { conditions = [], type } = params;

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
   * Process a block of properties by applying units to all values that require it.
   */
  protected processProperties(properties: Properties): ProcessedProperties {
    const props: { [key: string]: string } = {};

    objectLoop(properties, (value, property) => {
      if (value !== undefined) {
        props[property] = this.applyUnitToValue(property, value);
      }
    });

    return props;
  }

  /**
   * Process a rule block with the defined params and factories.
   */
  protected processRule(
    properties: Rule,
    params: StyleParams,
    onNestedRule: OnNestedRule,
    processProperty: boolean = false,
  ) {
    const classNames = new Set();

    objectLoop<Rule, Property>(properties, (value, prop) => {
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
