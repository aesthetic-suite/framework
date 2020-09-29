import {
  CSS,
  GenericProperties,
  NativeProperty,
  Value,
  ValueWithFallbacks,
} from '@aesthetic/types';
import { arrayLoop, hyphenate, objectLoop } from '@aesthetic/utils';
import { isUnitlessProperty } from '../helpers';
import { EngineOptions, RenderOptions } from '../types';

export function formatDeclaration(key: string, value: Value): CSS {
  return `${key}:${value};`;
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

  const suffix = engine.unitSuffixer
    ? engine.unitSuffixer(property as NativeProperty)
    : options.unit;

  return value + (suffix || 'px');
}

export function formatTokenizedRule(block: CSS, { conditions, selector = '' }: RenderOptions): CSS {
  let rule = `.#className#${selector} { ${block} }`;

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

export function createDeclaration(
  rule: CSS,
  property: string,
  value: Value | ValueWithFallbacks,
  options: RenderOptions,
  engine: EngineOptions,
): CSS {
  if (Array.isArray(value)) {
    return value.reduce((css, val) => createDeclaration(css, property, val, options, engine), rule);
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
  let css = '';

  objectLoop(properties, (value, key) => {
    css = createDeclaration(css, key, value, options, engine);
  });

  return css;
}
