/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { StyleDeclarations, ClassNames, CSSStyle } from '../../types';

export default class GlamorAdapter extends Adapter {
  extractFontFace(family: string, properties: CSSStyle, fromScope: string): CSSStyle {
    css.fontFace(properties);

    return super.extractFontFace(family, properties, fromScope);
  }

  extractKeyframes(name: string, properties: CSSStyle, fromScope: string): CSSStyle {
    css.keyframes(name, properties);

    return super.extractKeyframes(name, properties, fromScope);
  }

  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    const classNames = {};

    Object.keys(declarations).forEach((setName: string) => {
      let declaration = declarations[setName];

      if (!Array.isArray(declaration)) {
        // $FlowIssue We know it won't be a string once it gets here
        declaration = [declaration];
      }

      classNames[setName] = `${styleName}-${String(css(...declaration))}`;
    });

    return classNames;
  }
}
