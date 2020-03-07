import { LocalParser } from '@aesthetic/sss';
import { Renderer } from '@aesthetic/style';
import { ColorScheme, ContrastLevel, Theme } from '@aesthetic/system';
import { deepMerge } from '@aesthetic/utils';
import Sheet from './Sheet';
import { LocalSheetFactory, SheetQuery, ClassNameSheet } from './types';

export default class LocalSheet<T = unknown> extends Sheet {
  protected factory: LocalSheetFactory<T>;

  protected contrastVariants: { [K in ContrastLevel]?: LocalSheetFactory<T> } = {};

  protected renderedQueries = new WeakMap<SheetQuery, ClassNameSheet<string>>();

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

  compose(query: SheetQuery): LocalSheetFactory<T> {
    const factories = [this.factory];

    if (query.scheme && this.schemeVariants[query.scheme]) {
      factories.push(this.schemeVariants[query.scheme]!);
    }

    if (query.contrast && this.contrastVariants[query.contrast]) {
      factories.push(this.contrastVariants[query.contrast]!);
    }

    if (query.theme && this.themeVariants[query.theme]) {
      factories.push(this.themeVariants[query.theme]!);
    }

    if (factories.length === 1) {
      return factories[0];
    }

    return (params, tokens) => deepMerge(...factories.map(factory => factory(params, tokens)));
  }

  render(renderer: Renderer, theme: Theme, baseQuery: SheetQuery): ClassNameSheet<string> {
    const query: Required<SheetQuery> = {
      contrast: theme.contrast,
      dir: 'ltr',
      scheme: theme.scheme,
      theme: theme.name,
      ...baseQuery,
    };
    const cache = this.renderedQueries.get(query);

    if (cache) {
      return cache;
    }

    const classNames: ClassNameSheet<string> = {};
    const composer = this.compose(query);
    const styles = composer(theme.toFactories(), theme.toTokens());

    new LocalParser(
      {
        onClass(selector, className) {
          classNames[selector] = className;
        },
        onFontFace(fontFace) {
          renderer.renderFontFace(fontFace.toObject());
        },
        onKeyframes(keyframes, animationName) {
          renderer.renderKeyframes(keyframes.toObject(), animationName);
        },
        onRuleset(selector, block) {
          classNames[selector] = renderer.renderRule(block.toObject());
        },
      },
      {
        unit: renderer.options.unit,
      },
    ).parse(styles);

    this.renderedQueries.set(query, classNames);

    return classNames;
  }
}
