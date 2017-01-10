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

import type { RendererConfig } from 'fela';
import type { StyleDeclarationMap, ClassNameMap, CSSStyle } from '../../types';

const SRC_PATTERN = /src\((?:'|")?([^()])(?:'|")?\)/;

export default class UnifiedFelaAdapter extends FelaAdapter {
  syntax: UnifiedSyntax;

  constructor(config: RendererConfig = {}) {
    super(config);

    this.syntax = new UnifiedSyntax();
    this.syntax.on('declaration', this.onDeclaration);
    this.syntax.on('fontFace', this.onFontFace);
    this.syntax.on('keyframe', this.onKeyframe);
  }

  convert(declarations: StyleDeclarationMap): StyleDeclarationMap {
    return this.syntax.convert(declarations);
  }

  transform(styleName: string, declarations: StyleDeclarationMap): ClassNameMap {
    return super.transform(styleName, this.convert(declarations));
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
    const fontSource = String(properties.src);
    const files = [];
    let match;

    // eslint-disable-next-line no-cond-assign
    while (match = fontSource.match(SRC_PATTERN)) {
      files.push(match[1]);
    }

    this.syntax.fontFaceNames[familyName] = this.fela.renderFont(familyName, files, properties);
  }

  onKeyframe = (setName: string, animationName: string, properties: CSSStyle) => {
    this.syntax.keyframeNames[animationName] = this.fela.renderKeyframe(() => properties);
  };
}
