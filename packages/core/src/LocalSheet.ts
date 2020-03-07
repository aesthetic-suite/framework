import { LocalParser } from '@aesthetic/sss';
import { Renderer, Properties } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Theme } from '@aesthetic/system';
import { deepMerge } from '@aesthetic/utils';
import Sheet from './Sheet';
import { LocalSheetFactory, SheetParams, ClassNameSheet } from './types';

export default class LocalSheet<T = unknown> extends Sheet {
  protected factory: LocalSheetFactory<T>;

  protected contrastVariants: { [K in ContrastLevel]?: LocalSheetFactory<T> } = {};

  protected renderedQueries: { [cache: string]: ClassNameSheet<string> } = {};

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

    return (p, tokens) => deepMerge(...factories.map(factory => factory(p, tokens)));
  }

  render(renderer: Renderer, theme: Theme, baseParams: SheetParams): ClassNameSheet<string> {
    const params: Required<SheetParams> = {
      contrast: theme.contrast,
      direction: 'ltr',
      prefix: false,
      scheme: theme.scheme,
      theme: theme.name,
      unit: 'px',
      ...baseParams,
    };
    const cacheKey = JSON.stringify(params);
    const cache = this.renderedQueries[cacheKey];

    if (cache) {
      return cache;
    }

    const classNames: ClassNameSheet<string> = {};
    const composer = this.compose(params);
    const styles = composer(theme.toFactories(), theme.toTokens());
    const renderParams = {
      prefix: params.prefix,
      rtl: params.direction === 'rtl',
    };

    new LocalParser<Properties>({
      onClass(selector, className) {
        classNames[selector] = className;
      },
      onFontFace(fontFace) {
        renderer.renderFontFace(fontFace.toObject());
      },
      onKeyframes(keyframes, animationName) {
        renderer.renderKeyframes(animationName, keyframes.toObject(), renderParams);
      },
      onRuleset(selector, block) {
        classNames[selector] = renderer.renderRule(block.toObject(), renderParams);
      },
    }).parse(styles, {
      unit: params.unit,
    });

    this.renderedQueries[cacheKey] = classNames;

    return classNames;
  }
}
