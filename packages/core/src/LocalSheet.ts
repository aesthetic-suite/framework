import { LocalParser } from '@aesthetic/sss';
import { Renderer } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Theme } from '@aesthetic/system';
import { deepMerge, objectLoop } from '@aesthetic/utils';
import { Rule } from '@aesthetic/types';
import Sheet from './Sheet';
import { LocalSheetFactory, SheetParams, ClassNameSheet } from './types';

export default class LocalSheet<T = unknown> extends Sheet<ClassNameSheet<string>> {
  protected factory: LocalSheetFactory<T>;

  protected contrastVariants: { [K in ContrastLevel]?: LocalSheetFactory<T> } = {};

  protected schemeVariants: { [K in ColorScheme]?: LocalSheetFactory<T> } = {};

  protected themeVariants: { [theme: string]: LocalSheetFactory<T> } = {};

  constructor(factory: LocalSheetFactory<T>) {
    super();

    this.factory = this.validateFactory(factory);
  }

  addColorSchemeVariant(scheme: ColorScheme, factory: LocalSheetFactory<T>): this {
    if (__DEV__) {
      if (scheme !== 'light' && scheme !== 'dark') {
        throw new Error('Color scheme variant must be one of "light" or "dark".');
      }
    }

    this.schemeVariants[scheme] = this.validateFactory(factory);

    return this;
  }

  addContrastVariant(contrast: ContrastLevel, factory: LocalSheetFactory<T>): this {
    if (__DEV__) {
      if (contrast !== 'normal' && contrast !== 'high' && contrast !== 'low') {
        throw new Error('Contrast level variant must be one of "high", "low", or "normal".');
      }
    }

    this.contrastVariants[contrast] = this.validateFactory(factory);

    return this;
  }

  addThemeVariant(theme: string, factory: LocalSheetFactory<T>): this {
    this.themeVariants[theme] = this.validateFactory(factory);

    return this;
  }

  compose(params: SheetParams): LocalSheetFactory<T> {
    const factories = [this.factory];

    if (params.scheme && this.schemeVariants[params.scheme]) {
      factories.push(this.schemeVariants[params.scheme]!);
    }

    if (params.contrast && this.contrastVariants[params.contrast]) {
      factories.push(this.contrastVariants[params.contrast]!);
    }

    if (params.theme && this.themeVariants[params.theme]) {
      factories.push(this.themeVariants[params.theme]!);
    }

    if (factories.length === 1) {
      return factories[0];
    }

    return (p, tokens) => deepMerge(...factories.map((factory) => factory(p, tokens)));
  }

  protected doRender(
    renderer: Renderer,
    theme: Theme,
    params: Required<SheetParams>,
  ): ClassNameSheet<string> {
    const classNames: ClassNameSheet<string> = {};
    const composer = this.compose(params);
    const styles = composer(theme.toUtilities(), theme.toTokens());
    const rankCache = {};
    const renderParams = {
      rankings: rankCache,
      rtl: params.direction === 'rtl',
      unit: params.unit,
      vendor: params.vendor,
    };

    new LocalParser<Rule>({
      onClass(selector, className) {
        classNames[selector] = { class: className };
      },
      onFontFace(fontFace) {
        return renderer.renderFontFace(fontFace.toObject());
      },
      onKeyframes(keyframes, animationName) {
        return renderer.renderKeyframes(keyframes.toObject(), animationName, renderParams);
      },
      onRule(selector, rule) {
        const cache = classNames[selector] || {};

        cache.class = renderer.renderRule(rule.toObject(), renderParams);

        if (rule.variants) {
          if (!cache.variants) {
            cache.variants = {};
          }

          objectLoop(rule.variants.toObject(), (variant, type) => {
            cache.variants![type] = renderer.renderRule(variant as Rule, renderParams);
          });
        }

        classNames[selector] = cache;
      },
    }).parse(styles);

    return classNames;
  }
}
