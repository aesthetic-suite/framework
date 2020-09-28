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
import {
  arrayLoop,
  generateHash,
  hyphenate,
  isObject,
  objectLoop,
  objectReduce,
} from '@aesthetic/utils';
import { createAtomicCacheKey, formatVariableName, isVariable, processValue } from '../helpers';
import { CacheItem, Engine, EngineOptions, RenderOptions } from '../types';

const CHARS = 'abcdefghijklmnopqrstuvwxyz';
const CHARS_LENGTH = CHARS.length;

function generateClassName(rule: string, options: RenderOptions, engine: EngineOptions): ClassName {
  // Avoid hashes that start with an invalid number
  if (options.deterministic) {
    return `c${generateHash(rule)}`;
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

function cacheAndInsertAtRule(rule: CSS, options: RenderOptions, engine: EngineOptions) {
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
  rule: CSS,
  options: RenderOptions,
  engine: EngineOptions,
  minimumRank?: number,
): CacheItem {
  const { cacheManager, sheetManager, vendorPrefixer } = engine;
  const cacheKey = createAtomicCacheKey(rule, options);
  let item = cacheManager.read(cacheKey, minimumRank);

  if (!item) {
    // Generate class name and format CSS rule with class name
    const className = options.className || generateClassName(rule, options, engine);
    const css = rule.replace('#className#', className);

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

function formatDeclaration(property: string, value: Value): CSS {
  return `${hyphenate(property)}:${value};`;
}

function createDeclaration(
  rule: CSS,
  property: string,
  value: Value | ValueWithFallbacks,
  options: RenderOptions,
  engine: EngineOptions,
): CSS {
  if (Array.isArray(value)) {
    return value.reduce((css, val) => createDeclaration(css, property, val, options, engine), rule);
  }

  let key = hyphenate(property);
  let val = String(value);

  // Convert between LTR and RTL
  if (options.direction && engine.directionConverter) {
    ({ property: key, value: val } = engine.directionConverter.convert(
      engine.direction!,
      options.direction,
      key,
      val,
    ));
  }

  // Set the declaration after direction change but before prefixing
  rule += formatDeclaration(key, val);

  // Inject vendor prefixes into the parent rule
  if (options.vendor && engine.vendorPrefixer) {
    objectLoop(engine.vendorPrefixer.prefix(key, val), (v, k) => {
      rule += formatDeclaration(k, v);
    });
  }

  return rule;
}

function createDeclarationBlock(
  properties: GenericProperties,
  options: RenderOptions,
  engine: EngineOptions,
): CSS {
  let css = '';

  objectLoop(properties, (value, key) => {
    css = createDeclaration(css, key, value, options, engine);
  });

  return css;
}

function formatRuleWithoutClassName(block: CSS, { conditions, selector = '' }: RenderOptions): CSS {
  let rule = `#className#${selector} { ${block} }`;

  if (conditions) {
    if (Array.isArray(conditions)) {
      arrayLoop(
        conditions,
        (condition) => {
          rule = `${condition} { ${rule} }`;
        },
        true,
      );
    } else {
      rule = conditions.replace('#rule#', rule);
    }
  }

  return rule;
}

export function renderDeclaration<K extends Property>(
  property: K,
  value: Properties[K] | ValueWithFallbacks,
  options: RenderOptions,
  engine: EngineOptions,
): ClassName {
  const key = hyphenate(property);
  const val = processValue(key, value, options.unit);
  const block = createDeclaration('', key, val, options, engine);
  const rule = formatRuleWithoutClassName(block, options);

  const { rankings } = options;
  const { className, rank } = cacheAndInsertStyles(rule, options, engine, rankings?.[key]);

  // Persist the rank for specificity guarantees
  if (rankings && rank && (rankings[key] === undefined || rank > rankings[key])) {
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
      `${step} { ${createDeclarationBlock(keyframe as GenericProperties, options, engine)} } `,
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
  const rule = formatRuleWithoutClassName(
    formatDeclaration(formatVariableName(name), value),
    options,
  );

  return cacheAndInsertStyles(rule, options, engine).className;
}

export function renderRule(rule: Rule, options: RenderOptions, engine: EngineOptions) {
  const classNames: string[] = [];

  objectLoop<Rule, Property>(rule, (value, property) => {
    if (value === null || value === undefined) {
      if (__DEV__) {
        console.warn(`Invalid value "${value}" for "${property}".`);
      }
    } else if (isObject(value)) {
      classNames.push('');
    } else if (isVariable(property)) {
      classNames.push(renderVariable(property, value, options, engine));
    } else {
      classNames.push(renderDeclaration(property, value, options, engine));
    }
  });

  return classNames.join(' ');
}

export default function createEngine(options: EngineOptions): Engine {
  const engine: EngineOptions = {
    direction: 'ltr',
    ruleIndex: 0,
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
      renderKeyframes(keyframes, animationName, options || renderOptions, engine),
    renderRule: (rule, options) => renderRule(rule, options || renderOptions, engine),
    renderVariable: (name, value, options) =>
      renderVariable(name, value, options || renderOptions, engine),
  };
}
