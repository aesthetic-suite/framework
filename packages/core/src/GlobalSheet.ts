import BaseSheet from './BaseSheet';
import { GlobalSheetFactory } from './types';

export default class GlobalSheet<T = unknown> extends BaseSheet {
  protected factory: GlobalSheetFactory;

  constructor(factory: GlobalSheetFactory<T>) {
    super();

    this.factory = this.validateFactory(factory);
  }
}
