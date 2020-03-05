import { GlobalParser } from '@aesthetic/sss';
import { Renderer, ClassName } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import Sheet from './Sheet';
import { GlobalSheetFactory } from './types';

export default class GlobalSheet<T = unknown> extends Sheet {
  protected factory: GlobalSheetFactory<T>;

  protected renderedClassName?: ClassName;

  constructor(factory: GlobalSheetFactory<T>) {
    super();

    this.factory = this.validateFactory(factory);
  }

  compose(): GlobalSheetFactory<T> {
    return this.factory;
  }

  render(renderer: Renderer, theme: Theme): ClassName {
    if (this.renderedClassName !== undefined) {
      return this.renderedClassName;
    }

    let className = '';
    const composer = this.compose();
    const styles = composer(theme.toFactories(), theme.toTokens());

    // TODO @page, @viewport
    new GlobalParser({
      onFontFace(fontFace) {
        renderer.renderFontFace(fontFace.toObject());
      },
      onGlobal(block) {
        className = renderer.renderRuleGrouped(block.toObject(), { type: 'global' });
      },
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        renderer.renderKeyframes(keyframes.toObject(), animationName);
      },
    }).parse(styles);

    this.renderedClassName = className;

    return className;
  }
}
