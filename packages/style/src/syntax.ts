import {
  ClassName,
  CSS,
  GenericProperties,
  NativeProperty,
  Value,
  ValueWithFallbacks,
} from '@aesthetic/types';
import { arrayLoop, arrayReduce, hyphenate, objectLoop, objectReduce } from '@aesthetic/utils';
import { isUnitlessProperty, isVariable } from './helpers';
import { EngineOptions, RenderOptions } from './types';

export function formatVariable(name: string): string {
  let varName = hyphenate(name);

  if (!isVariable(varName)) {
    varName = `--${varName}`;
  }

  return varName;
}

export function formatProperty(property: string): string {
  return hyphenate(property);
}

export function formatValue(
  property: string,
  value: Value,
  options: RenderOptions,
  engine: EngineOptions,
): string {
  if (typeof value === 'string' || isUnitlessProperty(property) || value === 0) {
    return String(value);
  }

  let suffix = engine.unitSuffixer ? engine.unitSuffixer(property as NativeProperty) : options.unit;

  // TODO TEMP
  if (typeof suffix === 'function') {
    suffix = suffix(property as NativeProperty);
  }

  return value + (suffix || 'px');
}

export function formatDeclaration(key: string, value: Value): CSS {
  return `${key}:${value};`;
}

export function formatRule(
  className: ClassName,
  block: CSS,
  { conditions, selector = '' }: RenderOptions,
): CSS {
  let rule = `.${className}${selector} { ${block} }`;

  if (conditions) {
    arrayLoop(
      conditions,
      (condition) => {
        rule = `${condition} { ${rule} }`;
      },
      true,
    );
  }

  return rule;
}

export function createDeclaration(
  property: string,
  value: Value | ValueWithFallbacks,
  options: RenderOptions,
  engine: EngineOptions,
): CSS {
  let rule = '';

  if (Array.isArray(value)) {
    return arrayReduce(value, (val) => createDeclaration(property, val, options, engine), rule);
  }

  let key = formatProperty(property);
  let val = formatValue(property, value, options, engine);

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

export function createDeclarationBlock(
  properties: GenericProperties,
  options: RenderOptions,
  engine: EngineOptions,
): CSS {
  return objectReduce(properties, (value, key) => createDeclaration(key, value, options, engine));
}
