/* eslint-disable prefer-template, no-magic-numbers, no-use-before-define, @typescript-eslint/no-use-before-define */

import {
  CacheItem,
  ClassName,
  CSS,
  EngineOptions,
  FontFace,
  GenericProperties,
  Import,
  Keyframes,
  Properties,
  Property,
  RenderOptions,
  Rule,
  RuleMap,
  Value,
  ValueWithFallbacks,
} from '@aesthetic/types';
import {
  arrayLoop,
  generateHash,
  isObject,
  joinQueries,
  objectLoop,
  objectReduce,
} from '@aesthetic/utils';
import { StyleEngine } from '../types';
import { createCacheKey, createCacheManager } from './cache';
import { isAtRule, isNestedSelector, isValidValue, isVariable } from './helpers';
import {
  createDeclaration,
  createDeclarationBlock,
  formatDeclaration,
  formatFontFace,
  formatImport,
  formatProperty,
  formatRule,
  formatVariable,
} from './syntax';

type RenderCallback = (styleEngine: StyleEngine, rule: Rule, opts: RenderOptions) => ClassName;

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

function generateClassName(key: string, options: RenderOptions, engine: StyleEngine): ClassName {
  if (options.deterministic) {
    // Avoid hashes that start with an invalid number
    return `c${generateHash(key)}`;
  }

  engine.ruleIndex += 1;

  const index = engine.ruleIndex;

  if (index < CHARS_LENGTH) {
    return CHARS[index];
  }

  return CHARS[index % CHARS_LENGTH] + Math.floor(index / CHARS_LENGTH);
}

function insertAtRule(
  cacheKey: string,
  rule: CSS,
  options: RenderOptions,
  engine: StyleEngine,
): CacheItem {
  const { cacheManager, sheetManager } = engine;
  let item = cacheManager.read(cacheKey);

  if (!item) {
    item = { className: '' };
    sheetManager.insertRule(rule, { ...options, type: 'global' });
    cacheManager.write(cacheKey, item);
  }

  return item;
}

function insertStyles(
  cacheKey: string,
  render: (className: ClassName) => CSS,
  options: RenderOptions,
  engine: StyleEngine,
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
      options.selector && options.vendor && vendorPrefixer
        ? vendorPrefixer.prefixSelector(options.selector, css)
        : css,
      options,
    );

    // Cache the results for subsequent performance
    item = { className, rank };
    cacheManager.write(cacheKey, item);
  }

  return item;
}

function renderDeclaration<K extends Property>(
  engine: StyleEngine,
  property: K,
  value: NonNullable<Properties[K]> | ValueWithFallbacks,
  options: RenderOptions,
): ClassName {
  const key = formatProperty(property);
  const { rankings } = options;
  const { className, rank } = insertStyles(
    createCacheKey(key, value, options),
    (name) => formatRule(name, createDeclaration(key, value, options, engine), options),
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

function renderFontFace(engine: StyleEngine, fontFace: FontFace, options: RenderOptions): string {
  let name = fontFace.fontFamily;
  let block = createDeclarationBlock(
    formatFontFace(fontFace) as GenericProperties,
    options,
    engine,
  );

  if (!name) {
    name = `ff${generateHash(block)}`;
    block += formatDeclaration('font-family', name);
  }

  insertAtRule(
    createCacheKey('@font-face', name, options),
    `@font-face { ${block} }`,
    options,
    engine,
  );

  return name;
}

function renderImport(engine: StyleEngine, value: Import | string, options: RenderOptions): string {
  const path = formatImport(value);

  insertAtRule(createCacheKey('@import', path, options), `@import ${path};`, options, engine);

  return path;
}

function renderKeyframes(
  engine: StyleEngine,
  keyframes: Keyframes,
  animationName: string,
  options: RenderOptions,
): string {
  const block = objectReduce(
    keyframes,
    (keyframe, step) =>
      `${step} { ${createDeclarationBlock(keyframe as GenericProperties, options, engine)} } `,
  );

  const name = animationName || `kf${generateHash(block)}`;

  insertAtRule(
    createCacheKey('@keyframes', name, options),
    `@keyframes ${name} { ${block} }`,
    options,
    engine,
  );

  return name;
}

function renderVariable(
  engine: StyleEngine,
  name: string,
  value: Value,
  options: RenderOptions,
): ClassName {
  const key = formatVariable(name);

  return insertStyles(
    createCacheKey(key, value, options),
    (className) => formatRule(className, formatDeclaration(key, value), options),
    options,
    engine,
  ).className;
}

// It's much faster to set and unset options (conditions and selector) than it is
// to spread and clone the options object. Since rendering is synchronous, it just works!
function renderAtRules(
  engine: StyleEngine,
  rule: Rule,
  options: RenderOptions,
  render: RenderCallback,
): ClassName {
  const { media: originalMedia, selector: originalSelector, supports: originalSupports } = options;
  let className = '';

  if (rule['@media']) {
    objectLoop(rule['@media'], (condition, query) => {
      options.media = joinQueries(options.media, query);
      className += render(engine, condition, options) + ' ';
      options.media = originalMedia;
    });
  }

  if (rule['@selectors']) {
    objectLoop(rule['@selectors'], (nestedRule, selectorGroup) => {
      arrayLoop(selectorGroup.split(','), (selector) => {
        if (originalSelector === undefined) {
          options.selector = '';
        }

        options.selector += selector.trim();
        className += render(engine, nestedRule, options) + ' ';
        options.selector = originalSelector;
      });
    });
  }

  if (rule['@supports']) {
    objectLoop(rule['@supports'], (condition, query) => {
      options.supports = joinQueries(options.supports, query);
      className += render(engine, condition, options) + ' ';
      options.supports = originalSupports;
    });
  }

  if (rule['@variables']) {
    objectLoop(rule['@variables'], (value, name) => {
      className += renderVariable(engine, formatVariable(name), value, options) + ' ';
    });
  }

  return className.trim();
}

function renderRule(engine: StyleEngine, rule: Rule, options: RenderOptions): ClassName {
  let className = '';

  objectLoop(rule, (value, property) => {
    if (!isValidValue(property, value)) {
      return;
    }

    if (isObject<Rule>(value)) {
      if (isNestedSelector(property)) {
        (rule['@selectors'] ||= {})[property] = value;
      } else if (isAtRule(property)) {
        // Run later
      } else if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`Unknown property selector or nested block "${property}".`);
      }
    } else {
      className += renderDeclaration(engine, property as Property, value, options) + ' ';
    }
  });

  // Render at-rules last to somewhat ensure specificity
  className += renderAtRules(engine, rule, options, renderRule) + ' ';

  return className.trim();
}

function renderRuleGrouped(engine: StyleEngine, rule: Rule, options: RenderOptions): ClassName {
  const atRules: Rule = {};
  let variables: CSS = '';
  let properties: CSS = '';

  // Extract all nested rules first as we need to process them *after* properties
  objectLoop(rule, (value, property) => {
    if (!isValidValue(property, value)) {
      return;
    }

    if (isObject<Rule>(value)) {
      if (property === '@variables') {
        variables += formatDeclaration(property, value);
      } else if (isAtRule(property)) {
        atRules[property] = value as RuleMap;
      } else {
        (atRules['@selectors'] ||= {})[property] = value;
      }
    } else {
      properties += createDeclaration(property, value, options, engine);
    }
  });

  // Always use deterministic classes for grouped rules
  options.deterministic = true;

  // Insert rule styles only once
  const block = variables + properties;
  const { className } = insertStyles(
    createCacheKey(block, '', options),
    (name) => formatRule(name, block, options),
    options,
    engine,
  );

  // Render all at/nested rules with the parent class name
  options.className = className;

  renderAtRules(engine, atRules, options, renderRuleGrouped);

  return className;
}

const noop = () => {};

export function createStyleEngine(engineOptions: EngineOptions): StyleEngine {
  const renderOptions = {};
  const engine: StyleEngine = {
    atomic: true,
    cacheManager: createCacheManager(),
    direction: 'ltr',
    ruleIndex: -1,
    ...engineOptions,
    prefersColorScheme: () => false,
    prefersContrastLevel: () => false,
    renderDeclaration: (property, value, options) =>
      renderDeclaration(engine, property, value, options || renderOptions),
    renderFontFace: (fontFace, options) =>
      renderFontFace(engine, fontFace, options || renderOptions),
    renderImport: (path, options) => renderImport(engine, path, options || renderOptions),
    renderKeyframes: (keyframes, animationName, options) =>
      renderKeyframes(engine, keyframes, animationName || '', options || renderOptions),
    renderRule: (rule, options) => renderRule(engine, rule, options || renderOptions),
    renderRuleGrouped: (rule, options) => renderRuleGrouped(engine, rule, options || renderOptions),
    renderVariable: (name, value, options) =>
      renderVariable(engine, name, value, options || renderOptions),
    setDirection: noop,
    setRootVariables: noop,
    setTheme: noop,
  };

  return engine;
}
