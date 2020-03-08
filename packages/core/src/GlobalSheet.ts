import { GlobalParser } from '@aesthetic/sss';
import { Renderer, ClassName, Properties } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import Sheet from './Sheet';
import { GlobalSheetFactory, SheetParams } from './types';

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

  render(renderer: Renderer, theme: Theme, params: SheetParams): ClassName {
    if (this.renderedClassName !== undefined) {
      return this.renderedClassName;
    }

    let className = '';
    const composer = this.compose();
    const styles = composer(theme.toUtilities(), theme.toTokens());
    const renderParams = {
      prefix: params.prefix,
      rtl: params.direction === 'rtl',
    };

    // TODO @page, @viewport
    new GlobalParser<Properties>({
      onFontFace(fontFace) {
        renderer.renderFontFace(fontFace.toObject());
      },
      onGlobal(block) {
        className = renderer.renderRuleGrouped(block.toObject(), {
          ...renderParams,
          type: 'global',
        });
      },
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        renderer.renderKeyframes(animationName, keyframes.toObject(), renderParams);
      },
    }).parse(styles, {
      unit: params.unit,
    });

    this.renderedClassName = className;

    return className;
  }
}
