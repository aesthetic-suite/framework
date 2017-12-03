/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import type { AtRuleCache, FontFaces, StyleDeclaration } from '../../types';

export default function injectFontFaces(
  properties: StyleDeclaration,
  fontFaces: FontFaces | AtRuleCache<string[]>,
  flatten?: boolean = false,
) {
  let value = String(properties.fontFamily).split(',').map((name) => {
    const familyName = name.trim();
    const fonts = fontFaces[familyName];

    if (!fonts || fonts.length === 0) {
      return familyName;
    }

    return fonts[0]; // TODO support multiple?
  });

  if (flatten) {
    value = value.join(', ');
  }

  // $FlowIgnore Allow arrays here TODO
  properties.fontFamily = value;
}
