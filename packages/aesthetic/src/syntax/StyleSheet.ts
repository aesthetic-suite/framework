/**
 * @copyright   2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import Declaration from './Declaration';
import { ClassName } from '../types';

export default class StyleSheet<P extends object> {
  charset: string = 'utf8';

  fontFaces: Declaration<P>[] = [];

  imports: string[] = [];

  namespace: string = '';

  protected declarations: { [selector: string]: ClassName | Declaration<P> } = {};

  addDeclaration(selector: string, value: ClassName | Declaration<P>): this {
    this.declarations[selector] = value;

    return this;
  }

  createDeclaration(selector: string): Declaration<P> {
    return new Declaration(selector, this);
  }
}
