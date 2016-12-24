/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';
import deepMerge from 'lodash.merge';

import type { StyleDeclarations, ClassNames, CSSStyle } from '../../types';

export default class GlamorAdapter extends Adapter {
  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    properties = super.convertProperties(setName, properties);

    // Media queries
    if (this.mediaQueries[setName]) {
      deepMerge(properties, this.formatAtRules('@media', this.mediaQueries[setName]));
    }

    return properties;
  }

  extractFontFaces(setName: string, properties: CSSStyle, fromScope: string) {
    super.extractFontFaces(setName, properties, fromScope);

    Object.keys(properties).forEach((key: string) => {
      css.fontFace(properties[key]);
    });
  }

  extractKeyframes(setName: string, properties: CSSStyle, fromScope: string) {
    super.extractKeyframes(setName, properties, fromScope);

    Object.keys(properties).forEach((key: string) => {
      css.keyframes(key, properties[key]);
    });
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      classNames[setName] = `${styleName}-${String(css(declarations[setName]))}`;
    });

    return classNames;
  }
}
