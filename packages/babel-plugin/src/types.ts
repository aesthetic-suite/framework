import type { Aesthetic } from '@aesthetic/core';
import { PluginPass } from '@babel/core';
import { Path } from '@boost/common';

export interface State extends PluginPass {
  aesthetic: Aesthetic<unknown, {}>;
  filePath: Path;
  integrationModule: string;
  styleFactories: Record<string, string>;
}

export interface Options {
  setupPath: string;
}
