/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import { Adapter } from 'aesthetic';
import { css } from 'glamor';

import type { StyleDeclarations, ClassNames } from '../../types';

export default class GlamorAdapter extends Adapter {
  transform(styleName: string, declarations: StyleDeclarations): ClassNames {
    let sheet = this.sheets[styleName];

    if (!sheet) {
      this.sheets[styleName] = sheet = {
        sheet: {},
        classNames: {},
      };

      Object.keys(declarations).forEach((setName: string) => {
        let declaration = declarations[setName];

        if (!Array.isArray(declaration)) {
          // $FlowIssue We know it won't be a string once it gets here
          declaration = [declaration];
        }

        sheet.sheet[setName] = css(...declaration);
        sheet.classNames[setName] = `${styleName}-${sheet.sheet[setName]}`;
      });
    }

    return { ...sheet.classNames };
  }
}
