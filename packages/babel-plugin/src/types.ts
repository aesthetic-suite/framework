import type { Aesthetic, RenderResultSheet, SheetParams } from '@aesthetic/core';
import { PluginPass } from '@babel/core';
import { Path } from '@boost/common';

declare module '@babel/core' {
  interface BabelFile {
    aesthetic?: {
      renderResult: RenderResultSheet<unknown, string>;
    };
  }
}

export interface State extends PluginPass {
  aesthetic: Aesthetic<unknown, {}>;
  filePath: Path;
  integrationModule: string;
  renderParamsList: SheetParams[];
  styleFactories: Record<string, string>;
}

export interface Options {
  setupPath: string;
}
