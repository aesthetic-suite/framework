/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable no-param-reassign */

import UnifiedSyntax from 'aesthetic/unified';
import { injectAtRules, toArray } from 'aesthetic-utils';
import JSS from 'jss';
import JSSAdapter from './NativeAdapter';

import type {
  FontFace,
  Keyframe,
  MediaQuery,
  StyleDeclaration,
  StyleDeclarations,
  TransformedDeclarations,
} from '../../types';

export default class UnifiedJSSAdapter extends JSSAdapter {
  currentFontFaces: FontFace[] = [];

  currentKeyframes: Keyframe = {};

  currentMediaQueries: MediaQuery = {};

  syntax: UnifiedSyntax;

  constructor(jss: JSS, options?: Object = {}) {
    super(jss, options);

    this.syntax = new UnifiedSyntax();
    this.syntax
      .on('converting', this.onConverting)
      .on('declaration', this.onDeclaration)
      .on('fontFace', this.onFontFace)
      .on('keyframe', this.onKeyframe)
      .on('mediaQuery', this.onMediaQuery);
  }

  convert(declarations: StyleDeclarations): StyleDeclarations {
    const adaptedDeclarations = this.syntax.convert(declarations);
    const globalAtRules = ({}: StyleDeclaration);

    injectAtRules(globalAtRules, '@font-face', this.currentFontFaces);
    injectAtRules(globalAtRules, '@keyframes', this.currentKeyframes);
    injectAtRules(globalAtRules, '@media', this.currentMediaQueries);

    return {
      ...globalAtRules,
      ...adaptedDeclarations,
    };
  }

  transform<T: Object>(styleName: string, declarations: T): TransformedDeclarations {
    return super.transform(styleName, this.convert(declarations));
  }

  onConverting = () => {
    this.currentFontFaces = [];
    this.currentKeyframes = {};
    this.currentMediaQueries = {};
  };

  onDeclaration = (selector: string, properties: StyleDeclaration) => {
    // Prepend pseudos with an ampersand
    Object.keys(properties).forEach((propName: string) => {
      if (propName.charAt(0) === ':') {
        properties[`&${propName}`] = properties[propName];

        delete properties[propName];
      }
    });

    // Fallbacks
    if (this.syntax.fallbacks[selector]) {
      const fallbacks = [];

      Object.keys(this.syntax.fallbacks[selector]).forEach((propName: string) => {
        toArray(this.syntax.fallbacks[selector][propName]).forEach((propValue: *) => {
          fallbacks.push({ [propName]: propValue });
        });
      });

      properties.fallbacks = fallbacks;
    }
  };

  onFontFace = (selector: string, familyName: string, fontFaces: FontFace[]) => {
    this.currentFontFaces[familyName] = fontFaces;
  };

  onKeyframe = (selector: string, animationName: string, keyframe: Keyframe) => {
    this.currentKeyframes[animationName] = keyframe;
  };

  onMediaQuery = (selector: string, queryName: string, mediaQuery: MediaQuery) => {
    if (!this.currentMediaQueries[mediaQuery]) {
      this.currentMediaQueries[mediaQuery] = {};
    }

    const currentSet = this.currentMediaQueries[mediaQuery][selector];

    /* istanbul ignore next Hard to test. Only exists because of Flow */
    if (typeof currentSet === 'object' && !Array.isArray(currentSet)) {
      this.currentMediaQueries[mediaQuery][selector] = {
        ...currentSet,
        ...properties,
      };
    } else {
      this.currentMediaQueries[mediaQuery][selector] = properties;
    }
  };
}
