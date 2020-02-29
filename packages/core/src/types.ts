/* eslint-disable import/no-unresolved */

import {
  GlobalStyleSheet,
  GlobalStyleSheetNeverize,
  LocalStyleSheet,
  LocalStyleSheetNeverize,
} from '@aesthetic/sss';
import { MixinFactory, VarFactory, UnitFactory, Tokens } from '@aesthetic/system';

export * from '@aesthetic/sss/lib/types';
export * from '@aesthetic/system/lib/types';

export interface SheetParams {
  mixin: MixinFactory;
  unit: UnitFactory;
  var: VarFactory;
}

export type GlobalSheetFactory<T = unknown> = (
  params: SheetParams,
  tokens: Tokens,
) => T extends unknown ? GlobalStyleSheet : GlobalStyleSheet & GlobalStyleSheetNeverize<T>;

export type LocalSheetFactory<T = unknown> = (
  params: SheetParams,
  tokens: Tokens,
) => T extends unknown ? LocalStyleSheet : LocalStyleSheet & LocalStyleSheetNeverize<T>;
