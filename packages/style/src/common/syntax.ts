import {
  ClassName,
  CSS,
  GenericProperties,
  NativeProperty,
  RenderOptions,
  Value,
  ValueWithFallbacks,
} from '@aesthetic/types';
import { arrayLoop, arrayReduce, hyphenate, objectLoop, objectReduce } from '@aesthetic/utils';
import { isUnitlessProperty, isVariable } from './helpers';
import { StyleEngine } from '../types';

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
  engine: StyleEngine,
): string {
  if (typeof value === 'string' || isUnitlessProperty(property) || value === 0) {
    return String(value);
  }

  let suffix = options.unit;

  if (!suffix) {
    const { unitSuffixer } = engine;

    if (typeof unitSuffixer === 'function') {
      suffix = unitSuffixer(property as NativeProperty);
    } else {
      suffix = unitSuffixer;
    }
  }

  return value + (suffix || 'px');
}

export function formatDeclaration(key: string, value: Value): CSS {
  return `${key}:${value};`;
}

export function formatDeclarationBlock(properties: Record<string, Value>): CSS {
  return objectReduce(properties, (value, key) => formatDeclaration(key, value));
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
  engine: StyleEngine,
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

export function createDeclarationBlock(
  properties: GenericProperties,
  options: RenderOptions,
  engine: StyleEngine,
): CSS {
  return objectReduce(properties, (value, key) => createDeclaration(key, value, options, engine));
}
