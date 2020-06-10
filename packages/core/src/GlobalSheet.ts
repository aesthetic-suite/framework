import { GlobalParser } from '@aesthetic/sss';
import { Renderer, Rule } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import { ClassName } from '@aesthetic/types';
import Sheet from './Sheet';
import { GlobalSheetFactory, SheetParams } from './types';

export default class GlobalSheet<T = unknown> extends Sheet<ClassName> {
  protected factory: GlobalSheetFactory<T>;

  constructor(factory: GlobalSheetFactory<T>) {
    super();

    this.factory = this.validateFactory(factory);
  }

  compose(): GlobalSheetFactory<T> {
    return this.factory;
  }

  protected doRender(renderer: Renderer, theme: Theme, params: Required<SheetParams>): ClassName {
    let className = '';
    const composer = this.compose();
    const styles = composer(theme.toUtilities(), theme.toTokens());
    const renderParams = {
      rtl: params.direction === 'rtl',
      unit: params.unit,
      vendor: params.vendor,
    };

    // TODO @page, @viewport
    new GlobalParser<Rule>({
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject());
      },
      onGlobal(block) {
        className = renderer.renderRuleGrouped(block.toObject(), {
          ...renderParams,
          deterministic: true,
          type: 'global',
        });
      },
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
    }).parse(styles);

    return className;
  }
}
