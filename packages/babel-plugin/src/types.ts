import type { Aesthetic } from '@aesthetic/core';
import { PluginPass } from '@babel/core';

export interface State extends PluginPass {
  aesthetic?: Aesthetic<unknown>;
  integrationModule: string;
  styleFactories: Record<string, string>;
}

export interface Options {
  setupPath: string;
}
