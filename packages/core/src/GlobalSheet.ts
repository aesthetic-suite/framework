import Sheet from './Sheet';
import { GlobalSheetFactory } from './types';

export default class GlobalSheet<T = unknown> extends Sheet {
  protected factory: GlobalSheetFactory;

  constructor(factory: GlobalSheetFactory<T>) {
    super();

    this.factory = this.validateFactory(factory);
  }
}
