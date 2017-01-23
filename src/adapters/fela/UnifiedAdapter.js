/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import UnifiedSyntax from '../../UnifiedSyntax';
import injectAtRules from '../../utils/injectAtRules';
import injectFallbacks from '../../utils/injectFallbacks';
import injectRuleByLookup from '../../utils/injectRuleByLookup';
import FelaAdapter from './NativeAdapter';

import type { Renderer } from 'fela';
import type { StyleDeclarationMap, TransformedStylesMap, CSSStyle } from '../../types';

const SRC_PATTERN = /url\((?:'|")?([^()'"]+)(?:'|")?\)/ig;

export default class UnifiedFelaAdapter extends FelaAdapter {
  syntax: UnifiedSyntax;

  constructor(fela: Renderer, options: Object = {}) {
    super(fela, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('declaration', this.onDeclaration)
      .on('fontFace', this.onFontFace)
      .on('keyframe', this.onKeyframe);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarationMap): TransformedStylesMap {
    return super.transform(styleName, this.convert(declarations));
  }

  extractFontSources(source: string): string[] {
    return (source.match(SRC_PATTERN) || []).map((url: string) => (
      url.replace(/"|'|url\(|\)/g, '')
    ));
  }

  onDeclaration = (setName: string, properties: CSSStyle) => {
    // Font faces
    if ('fontFamily' in properties) {
      injectRuleByLookup(properties, 'fontFamily', this.syntax.fontFaceNames, true);
    }

    // Animation keyframes
    if ('animationName' in properties) {
      injectRuleByLookup(properties, 'animationName', this.syntax.keyframeNames, true);
    }

    // Media queries
    if (this.syntax.mediaQueries[setName]) {
      injectAtRules(properties, '@media', this.syntax.mediaQueries[setName]);
    }

    // Fallbacks
    if (this.syntax.fallbacks[setName]) {
      injectFallbacks(properties, this.syntax.fallbacks[setName]);
    }
  };

  onFontFace = (setName: string, familyName: string, properties: CSSStyle) => {
    this.syntax.fontFaceNames[familyName] = this.fela.renderFont(
      familyName,
      this.extractFontSources(String(properties.src)),
      properties,
    );
  }

  onKeyframe = (setName: string, animationName: string, properties: CSSStyle) => {
    this.syntax.keyframeNames[animationName] = this.fela.renderKeyframe(() => properties);
  };
}
