/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import getFontFormat from './getFontFormat';

import type { AtRuleMap, StyleDeclaration } from '../../types';

export default function injectFonts(
  properties: StyleDeclaration,
  fontFaces: AtRuleMap,
  flattenSrc?: boolean = false,
) {
  properties.fontFamily = String(properties.fontFamily).split(',').map((name) => {
    const fontName = name.trim();

    if (fontFaces[fontName]) {
      const props = { ...fontFaces[fontName] };

      if (flattenSrc) {
        props.src = props.src
          .map(path => `url('${path}') format('${getFontFormat(path)}')`)
          .join(', ');
      }

      return props;
    }

    return name;
  });
}
