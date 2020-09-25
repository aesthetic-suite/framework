/* eslint-disable no-param-reassign */

import { toArray } from '@aesthetic/utils';
import parseFontFace from '../parsers/parseFontFace';
import parseKeyframes from '../parsers/parseKeyframes';
import { AddPropertyCallback, ParserOptions } from '../types';

function handleCompound(
  property: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser: (value: any, name: string, options: any) => void,
  options: object,
) {
  return (value: string | object, add: AddPropertyCallback) => {
    let name = '';

    if (typeof value === 'string') {
      name = value;
    } else {
      const items = toArray(value).map((item) =>
        typeof item === 'string' ? item : parser(item, '', options),
      );

      name = Array.from(new Set(items)).filter(Boolean).join(', ');
    }

    if (name) {
      add(property, name);
    }
  };
}

export default function setupDefaultOptions<T extends object>(
  options: Partial<ParserOptions<T>>,
): ParserOptions<T> {
  if (!options.customProperties) {
    options.customProperties = {};
  }

  if (!options.customProperties.animationName) {
    options.customProperties.animationName = handleCompound(
      'animationName',
      parseKeyframes,
      options,
    );
  }

  if (!options.customProperties.fontFamily) {
    options.customProperties.fontFamily = handleCompound('fontFamily', parseFontFace, options);
  }

  return options as ParserOptions<T>;
}
