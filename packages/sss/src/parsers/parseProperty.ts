import { Property } from '@aesthetic/types';
import { isObject } from '@aesthetic/utils';
import processCompoundProperty from '../helpers/processCompoundProperty';
import Block from '../Block';
import { ParserOptions, FontFace, Keyframes, AddPropertyCallback } from '../types';
import parseFontFace from './parseFontFace';
import parseKeyframes from './parseKeyframes';

export default function parseProperty<T extends object>(
  parent: Block<T>,
  name: Property,
  value: unknown,
  options: ParserOptions<T>,
) {
  const handler: AddPropertyCallback = (p, v) => {
    if (v !== undefined) {
      parent.addProperty(p, v);
      options.onProperty?.(parent, p, v);
    }
  };

  // Convert expanded properties to longhand
  if (EXPANDED_PROPERTIES.has(name) && isObject(value)) {
    processExpandedProperty(name, value, expandedProperties[name], handler);

    return;
  }

  // Convert compound properties
  if (COMPOUND_PROPERTIES.has(name) && (isObject(value) || Array.isArray(value))) {
    const compoundProperties: ProcessorMap = {
      animationName: (prop: Keyframes) => parseKeyframes(prop, '', options),
      fontFamily: (prop: FontFace) => parseFontFace(prop, '', options),
    };

    processCompoundProperty(name, value, compoundProperties[name], handler);

    return;
  }

  // Normal property
  if (typeof value === 'number' || typeof value === 'string') {
    handler(name, value);
  }
}
