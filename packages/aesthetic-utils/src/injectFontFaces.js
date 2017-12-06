/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import formatFontFace from './formatFontFace';

import type { FontFace, StyleDeclaration } from '../../types';

type InjectFontFacesOptions = {
  format?: boolean,
  join?: boolean,
};

export default function injectFontFaces(
  properties: StyleDeclaration,
  fontFaces: { [fontFamily: string]: (string | FontFace)[] },
  options?: InjectFontFacesOptions = {},
) {
  if (!properties.fontFamily) {
    return;
  }

  const value = [];

  String(properties.fontFamily).split(',').forEach((name) => {
    const familyName = name.trim();
    const fonts = fontFaces[familyName];

    if (Array.isArray(fonts)) {
      value.push(...fonts.map((font) => {
        if (options.format && typeof font !== 'string') {
          return formatFontFace(font);
        }

        return font;
      }));
    } else {
      value.push(familyName);
    }
  });

  if (options.join) {
    properties.fontFamily = value.join(', ');
  } else {
    // $FlowIgnore Hard to resolve this type
    properties.fontFamily = value;
  }
}
