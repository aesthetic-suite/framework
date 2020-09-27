import { ClassName, CSS, Properties, Property, Rule, Value } from '@aesthetic/types';
import { arrayLoop, hyphenate, isObject, objectLoop } from '@aesthetic/utils';
import { createAtomicCacheKey, formatDeclaration, isVariable, processValue } from '../helpers';
import { CacheItem, EngineOptions, RenderOptions } from '../types';

function checkValidValue(name: string, value: unknown) {
  if (value === null || value === undefined || value === true || value === false) {
    console.warn(`Invalid value "${value}" for "${name}".`);
  }
}

function generateClassName(rule: string, options: RenderOptions): ClassName {
  return '';
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
    const className = options.className || generateClassName(rule, options);
    const css = rule.replace('#className#', className);

    // Insert rule and return a rank (insert index)
    const rank = sheetManager.insertRule(
      options.type || 'standard',
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

function createDeclarationBlock(
  rule: CSS,
  property: string,
  value: Value,
  options: RenderOptions,
  engine: EngineOptions,
): CSS {
  let key = property;
  let val = value;

  // Convert between LTR and RTL
  if (options.direction && engine.directionConverter) {
    ({ property: key, value: val } = engine.directionConverter.convert(
      engine.direction,
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

function renderDeclaration<K extends Property>(
  property: K,
  value: Properties[K],
  options: RenderOptions,
  engine: EngineOptions,
): ClassName {
  if (__DEV__) {
    checkValidValue(property, value);
  }

  const key = hyphenate(property);
  const val = processValue(key, value, options.unit);
  const block = createDeclarationBlock('', key, val, options, engine);
  const rule = formatRuleWithoutClassName(block, options);

  const { rankings } = options;
  const { className, rank } = cacheAndInsertStyles(rule, options, engine, rankings?.[key]);

  // Persist the rank for specificity guarantees
  if (rankings && rank && (rankings[key] === undefined || rank > rankings[key])) {
    rankings[key] = rank;
  }

  return className;
}

function renderVariable(name: string, value: Value): ClassName {
  if (__DEV__) {
    checkValidValue(name, value);
  }

  // TODO
  return '';
}

function renderRule(rule: Rule, options: RenderOptions, engine: EngineOptions) {
  const classNames: string[] = [];

  objectLoop<Rule, Property>(rule, (value, property) => {
    if (isObject(value)) {
      classNames.push('');
    } else if (isVariable(property)) {
      classNames.push(renderVariable(property, value as Value));
    } else {
      classNames.push(renderDeclaration(property, value, options, engine));
    }
  });

  return classNames.join(' ');
}
