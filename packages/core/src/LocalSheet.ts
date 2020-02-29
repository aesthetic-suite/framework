import { ColorScheme, ContrastLevel } from '@aesthetic/system';
import { deepMerge } from '@aesthetic/utils';
import Sheet from './Sheet';
import { LocalSheetFactory, SheetQuery } from './types';

export default class LocalSheet<T = unknown> extends Sheet {
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
}
