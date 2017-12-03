import type { StyleDeclaration } from '../src/types';

declare module 'fela' {
  declare export type Rule = StyleDeclaration | ((props: Object) => StyleDeclaration);

  declare export type RendererConfig = {
    enhancers?: (() => void)[],
    keyframePrefixes?: string[],
    mediaQueryOrder?: string[],
    plugins?: (() => void)[],
    selectorPrefix?: string,
  };

  declare export class Renderer {
    renderRule(rule: Rule, props?: StyleDeclaration): string;
    renderKeyframe(keyframe: Rule, props?: StyleDeclaration): string;
    renderFont(family: string, files: string[], props?: StyleDeclaration): string;
  }

  declare export function createRenderer(config?: RendererConfig): Renderer;
}

declare module 'fela-dom' {
  import type { Renderer } from 'fela';

  declare export function render(renderer: Renderer, mountNode: HTMLElement): void;
}
