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
  keyframesHashes: { [key: string]: string } = {};

  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = super.convertProperties(setName, properties);

    // Animation keyframes
    if ('animationName' in nextProperties) {
      nextProperties.animationName = this.keyframesHashes[nextProperties.animationName];
    }

    // Media queries
    if (this.mediaQueries[setName]) {
      deepMerge(nextProperties, this.formatAtRules('@media', this.mediaQueries[setName]));
    }

    // Fallbacks
    if (this.fallbacks[setName]) {
      Object.keys(this.fallbacks[setName]).forEach((propName: string) => {
        const fallback = this.fallbacks[setName][propName];

        if (nextProperties[propName]) {
          nextProperties[propName] = (
            Array.isArray(fallback) ? fallback : [fallback]
          ).concat(nextProperties[propName]);
        }
      });
    }

    return nextProperties;
  }

  onExtractedFontFace(setName: string, familyName: string, properties: CSSStyle) {
    css.fontFace(properties);
  }

  onExtractedKeyframes(setName: string, animationName: string, properties: CSSStyle) {
    this.keyframesHashes[animationName] = css.keyframes(animationName, properties);
  }

  transformStyles(styleName: string, declarations: StyleDeclarations): ClassNames {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      classNames[setName] = `${styleName}-${String(css(declarations[setName]))}`;
    });

    return classNames;
  }
}
