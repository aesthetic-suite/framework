import { ColorScheme, ContrastLevel } from '@aesthetic/system';
import Sheet from './Sheet';
import { LocalSheetFactory } from './types';

export default class LocalSheet<T = unknown> extends Sheet {
  protected factory: LocalSheetFactory;

  protected contrastVariants: { [K in ContrastLevel]?: LocalSheetFactory } = {};

  protected schemeVariants: { [K in ColorScheme]?: LocalSheetFactory } = {};

  protected themeVariants: { [theme: string]: LocalSheetFactory } = {};

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
}
