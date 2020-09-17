import { Property, Value } from '@aesthetic/types';
import { isObject } from '@aesthetic/utils';
import processCompoundProperty from '../helpers/processCompoundProperty';
import { expandedProperties } from '../properties';
import Block from '../Block';
import { Events, FontFace, Keyframes, ProcessorMap } from '../types';
import { COMPOUND_PROPERTIES, EXPANDED_PROPERTIES } from '../constants';
import parseFontFace from './parseFontFace';
import parseKeyframes from './parseKeyframes';

export default function parseProperty<T extends object>(
  parent: Block<T>,
  name: Property,
  value: unknown,
  events: Events<T>,
) {
  const handler = (n: Property, v: Value) => {
    parent.addProperty(n, v);
    events.onBlockProperty?.(parent, n, v);
  };

  // Convert expanded properties to longhand
  if (EXPANDED_PROPERTIES.has(name) && isObject(value)) {
    processCompoundProperty(name, value, expandedProperties[name], handler);

    return;
  }

  // Convert compound properties
  if (COMPOUND_PROPERTIES.has(name) && (isObject(value) || Array.isArray(value))) {
    const compoundProperties: ProcessorMap = {
      animationName: (prop: Keyframes) => parseKeyframes(prop, '', events),
      fontFamily: (prop: FontFace) => parseFontFace(prop, '', events),
    };

    processCompoundProperty(name, value, compoundProperties[name], handler);

    return;
  }

  // Normal property
  if (typeof value === 'number' || typeof value === 'string') {
    handler(name, value);
  }
}
