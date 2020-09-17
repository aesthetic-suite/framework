import { GlobalParser } from '@aesthetic/sss';
import { Renderer } from '@aesthetic/style';
import { Theme } from '@aesthetic/system';
import { ClassName, Rule } from '@aesthetic/types';
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
    const styles = composer(theme, theme.tokens);
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
      onImport(path) {
        renderer.renderImport(path);
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
      onRoot(block) {
        className = renderer.renderRuleGrouped(block.toObject(), {
          ...renderParams,
          deterministic: true,
          type: 'global',
        });
      },
    }).parse(styles);

    return className;
  }
}
