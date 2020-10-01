import {
  ClassName,
  CSS,
  FontFace,
  GenericProperties,
  Keyframes,
  Properties,
  Property,
  Rule,
  Value,
  ValueWithFallbacks,
} from '@aesthetic/types';
import { generateHash, isObject, objectLoop, objectReduce } from '@aesthetic/utils';
import { createCacheKey } from './cache';
import { isAtRule, isNestedSelector, isVariable } from './helpers';
import {
  createDeclaration,
  createDeclarationBlock,
  formatProperty,
  formatDeclaration,
  formatRule,
  formatVariable,
} from './syntax';
import { CacheItem, Engine, EngineOptions, RenderOptions } from './types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

function generateClassName(key: string, options: RenderOptions, engine: EngineOptions): ClassName {
  if (options.deterministic) {
    // Avoid hashes that start with an invalid number
    return `c${generateHash(key)}`;
  }

  if (engine.ruleIndex === undefined) {
    engine.ruleIndex = 0;
  } else {
    engine.ruleIndex += 1;
  }

  const index = engine.ruleIndex;

  if (index < CHARS_LENGTH) {
    return CHARS[index];
  }

  return CHARS[index % CHARS_LENGTH] + Math.floor(index / CHARS_LENGTH);
}

function cacheAndInsertAtRule(rule: CSS, options: RenderOptions, engine: EngineOptions): CacheItem {
  const { cacheManager, sheetManager } = engine;
  let item = cacheManager.read(rule);

  if (!item) {
    sheetManager.insertRule(options.type || 'global', rule);

    // Generate a unique hash to use as the class name
    item = { className: generateClassName(rule, { deterministic: true }, engine) };
    cacheManager.write(rule, item);
  }

  return item;
}

function cacheAndInsertStyles(
  cacheKey: string,
  render: (className: ClassName) => CSS,
  options: RenderOptions,
  engine: EngineOptions,
  minimumRank?: number,
): CacheItem {
  const { cacheManager, sheetManager, vendorPrefixer } = engine;
  let item = cacheManager.read(cacheKey, minimumRank);

  if (!item) {
    // Generate class name and format CSS rule with class name
    const className = options.className || generateClassName(cacheKey, options, engine);
    const css = render(className);

    // Insert rule and return a rank (insert index)
    const rank = sheetManager.insertRule(
      options.type || (options.conditions ? 'conditions' : 'standard'),
      options.selector && options.vendor && vendorPrefixer
        ? vendorPrefixer.prefixSelector(options.selector, css)
        : css,
    );

    // Cache the results for subsequent performance
    item = { className, rank };
    cacheManager.write(cacheKey, item);
  }

  return item;
}

export function renderDeclaration<K extends Property>(
  property: K,
  value: NonNullable<Properties[K]> | ValueWithFallbacks,
  options: RenderOptions,
  engine: EngineOptions,
): ClassName {
  const key = formatProperty(property);
  const { rankings } = options;
  const { className, rank } = cacheAndInsertStyles(
    createCacheKey(key, value, options),
    (className) => formatRule(className, createDeclaration(key, value, options, engine), options),
    options,
    engine,
    rankings?.[key],
  );

  // Persist the rank for specificity guarantees
  if (rankings && rank !== undefined && (rankings[key] === undefined || rank > rankings[key])) {
    rankings[key] = rank;
  }

  return className;
}

export function renderFontFace(
  fontFace: FontFace,
  options: RenderOptions,
  engine: EngineOptions,
): string {
  let name = fontFace.fontFamily;
  let block = createDeclarationBlock(fontFace as GenericProperties, options, engine);

  if (!name) {
    name = `ff${generateHash(block)}`;
    block += formatDeclaration('font-family', name);
  }

  cacheAndInsertAtRule(`@font-face { ${block} }`, options, engine);

  return name;
}

export function renderImport(path: string, options: RenderOptions, engine: EngineOptions) {
  cacheAndInsertAtRule(`@import ${path};`, options, engine);
}

export function renderKeyframes(
  keyframes: Keyframes,
  animationName: string,
  options: RenderOptions,
  engine: EngineOptions,
): string {
  const block = objectReduce(
    keyframes,
    (keyframe, step) =>
      `${step} { ${createDeclarationBlock(keyframe as GenericProperties, options, engine)} }`,
  );

  const name = animationName || `kf${generateHash(block)}`;

  cacheAndInsertAtRule(`@keyframes ${name} { ${block} }`, options, engine);

  return name;
}

export function renderVariable(
  name: string,
  value: Value,
  options: RenderOptions,
  engine: EngineOptions,
): ClassName {
  const key = formatVariable(name);

  return cacheAndInsertStyles(
    createCacheKey(key, value, options),
    (className) => formatRule(className, formatDeclaration(key, value), options),
    options,
    engine,
  ).className;
}

// It's much faster to set and unset options (conditions and selector) than it is
// to spread and clone the options object. Since rendering is synchronous, it just works!
export function renderRule(rule: Rule, options: RenderOptions, engine: EngineOptions): ClassName {
  const classNames: string[] = [];

  objectLoop<Rule, Property>(rule, (value, property) => {
    if (value === null || value === undefined) {
      if (__DEV__) {
        console.warn(`Invalid value "${value}" for "${property}".`);
      }
    } else if (isObject<Rule>(value)) {
      // At-rules
      if (isAtRule(property)) {
        if (!options.conditions) {
          options.conditions = [];
        }

        options.conditions.push(property);
        classNames.push(renderRule(value, options, engine));
        options.conditions.pop();

        // Selectors
      } else if (isNestedSelector(property)) {
        options.selector = property;
        classNames.push(renderRule(value, options, engine));
        options.selector = undefined;

        // Unknown
      } else if (__DEV__) {
        console.warn(`Unknown property selector or nested block "${property}".`);
      }

      // Variables
    } else if (isVariable(property)) {
      classNames.push(renderVariable(property, value, options, engine));

      // Properties
    } else {
      classNames.push(renderDeclaration(property, value, options, engine));
    }
  });

  return classNames.join(' ');
}

export function renderRuleGrouped(
  rule: Rule,
  options: RenderOptions,
  engine: EngineOptions,
): ClassName {
  const nestedRules: Record<string, Rule> = {};
  let variables: CSS = '';
  let properties: CSS = '';

  // Extract all nested rules first as we need to process them *after* properties
  objectLoop<Rule, Property>(rule, (value, property) => {
    if (value === null || value === undefined) {
      if (__DEV__) {
        console.warn(`Invalid value "${value}" for "${property}".`);
      }
    } else if (isObject<Rule>(value)) {
      nestedRules[property] = value;
    } else if (isVariable(property)) {
      variables += formatDeclaration(property, value);
    } else {
      properties += createDeclaration(property, value, options, engine);
    }
  });

  // Always use deterministic classes for grouped rules
  options.deterministic = true;

  // Insert rule styles only once
  const block = variables + properties;
  let { className } = cacheAndInsertStyles(
    createCacheKey(block, '', options),
    (className) => formatRule(className, block, options),
    options,
    engine,
  );

  // Render all nested rules and append class names
  objectLoop(nestedRules, (nestedRule, selector) => {
    options.selector = selector;

    className += ' ';
    className += renderRuleGrouped(nestedRule, options, engine);
  });

  return className;
}

export default function createEngine(options: EngineOptions): Engine {
  const engine: EngineOptions = {
    direction: 'ltr',
    ruleIndex: -1,
    ...options,
  };
  const renderOptions = {};

  return {
    renderDeclaration: (property, value, options) =>
      renderDeclaration(property, value, options || renderOptions, engine),
    renderFontFace: (fontFace, options) =>
      renderFontFace(fontFace, options || renderOptions, engine),
    renderImport: (path, options) => renderImport(path, options || renderOptions, engine),
    renderKeyframes: (keyframes, animationName, options) =>
      renderKeyframes(keyframes, animationName || '', options || renderOptions, engine),
    renderRule: (rule, options) => renderRule(rule, options || renderOptions, engine),
    renderVariable: (name, value, options) =>
      renderVariable(name, value, options || renderOptions, engine),
  };
}
