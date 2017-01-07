/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import injectAtRules from 'aesthetic/lib/helpers/injectAtRules';
import injectFallbacks from 'aesthetic/lib/helpers/injectFallbacks';
import { css } from 'glamor';

import type { StyleDeclarationMap, ClassNameMap, CSSStyle } from 'aesthetic';

export default class GlamorAdapter extends Adapter {
  convertProperties(setName: string, properties: CSSStyle): CSSStyle {
    const nextProperties = super.convertProperties(setName, properties);

    // Animation keyframes
    if ('animationName' in nextProperties) {
      nextProperties.animationName = this.keyframeNames[nextProperties.animationName];
    }

    // Media queries
    if (this.mediaQueries[setName]) {
      injectAtRules(nextProperties, '@media', this.mediaQueries[setName]);
    }

    // Fallbacks
    if (this.fallbacks[setName]) {
      injectFallbacks(nextProperties, this.fallbacks[setName]);
    }

    return nextProperties;
  }

  onExtractedFontFace(setName: string, familyName: string, properties: CSSStyle) {
    this.fontFaceNames[familyName] = css.fontFace(properties);
  }

  onExtractedKeyframe(setName: string, animationName: string, properties: CSSStyle) {
    this.keyframeNames[animationName] = css.keyframes(animationName, properties);
  }

  transformStyles(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      classNames[setName] = `${styleName}-${String(css(declarations[setName]))}`;
    });

    return classNames;
  }
}
