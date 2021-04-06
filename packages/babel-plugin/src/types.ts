import type {
  Aesthetic,
  CompiledRenderResultSheet,
  LocalSheet,
  SheetParams,
} from '@aesthetic/core';
import { BabelFile, NodePath, types as t } from '@babel/core';
import { Path } from '@boost/common';

export interface State {
  aesthetic: Aesthetic<unknown, {}>;
  filePath: Path;
  integrationModule: string;
  renderParamsList: SheetParams[];
  styleFactories: Record<string, string>;
  // Babel
  cwd: string;
  filename: string;
  file: Omit<BabelFile, 'metadata'> & {
    metadata: {
      aesthetic?: {
        renderResult: CompiledRenderResultSheet;
      };
    };
  };
}

export interface Options {
  setupPath: string;
}

export type RenderRuntimeCallback = (
  varPath: NodePath<t.VariableDeclaration>,
  varName: string,
  renderResult: t.ObjectExpression,
) => void;

export type UnknownLocalSheet = LocalSheet<unknown, {}, unknown>;
