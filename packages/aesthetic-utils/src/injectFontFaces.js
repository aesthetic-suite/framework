/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import formatFontFace from './formatFontFace';

import type { AtRuleCache, FontFaces, StyleDeclaration } from '../../types';

type InjectFontFacesOptions = {
  format?: boolean,
};

export default function injectFontFaces(
  properties: StyleDeclaration,
  fontFaces: FontFaces | AtRuleCache<string[]>,
  options?: InjectFontFacesOptions = {},
) {
  const value = [];

  String(properties.fontFamily).split(',').forEach((name) => {
    const familyName = name.trim();
    const fonts = fontFaces[familyName];

    if (fonts) {
      value.push(...fonts.map((font) => {
        if (typeof font === 'string') {
          return font;
        } else if (options.format) {
          return formatFontFace(font);
        }

        return font;
      }));
    } else {
      value.push(familyName);
    }
  });

  // $FlowIgnore Allow arrays here TODO
  properties.fontFamily = value;
}
