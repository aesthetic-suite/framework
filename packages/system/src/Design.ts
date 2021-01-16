import { deepMerge } from '@aesthetic/utils';
import { DEPTHS } from './constants';
import Theme from './Theme';
import { DeepPartial, DesignTokens, MixinTemplateMap, ThemeOptions, ThemeTokens } from './types';

export default class Design<T extends object> {
  readonly mixins?: MixinTemplateMap<T>;

  readonly name: string;

  readonly rootLineHeight: number;

  readonly rootTextSize: number;

  readonly spacingUnit: number;

  readonly tokens: DesignTokens;

  constructor(name: string, tokens: Omit<DesignTokens, 'depth'>, mixins?: MixinTemplateMap<T>) {
    this.name = name;
    this.mixins = mixins;
    this.tokens = { ...tokens, depth: DEPTHS };
    this.rootLineHeight = tokens.typography.rootLineHeight;
    this.rootTextSize = Number.parseFloat(tokens.typography.rootTextSize);

    // Pre-compiled for the chosen type, no need to calculate manually
    this.spacingUnit = tokens.spacing.unit;
  }

  /**
   * Create a new theme with the defined theme tokens, while inheriting the shared design tokens.
   */
  createTheme(options: ThemeOptions, tokens: ThemeTokens): Theme<T> {
    return new Theme(options, tokens, this);
  }

  /**
   * Extend and instantiate a new design instance with customized design tokens.
   */
  extend(name: string, tokens: DeepPartial<DesignTokens>, mixins?: MixinTemplateMap<T>): Design<T> {
    return new Design(name, deepMerge(this.tokens, tokens), { ...this.mixins, ...mixins });
  }
}
