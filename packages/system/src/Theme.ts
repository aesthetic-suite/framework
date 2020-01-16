import deepMerge from 'extend';
import { DeclarationBlock } from '@aesthetic/sss';
import mixins from './mixins';
import {
  ColorScheme,
  ContrastLevel,
  ThemeOptions,
  Tokens,
  DeepPartial,
  ThemeTokens,
  Mixins,
} from './types';

type MixinTarget =
  | 'border.sm'
  | 'border.df'
  | 'border.lg'
  | 'heading.l1'
  | 'heading.l2'
  | 'heading.l3'
  | 'heading.l4'
  | 'heading.l5'
  | 'heading.l6'
  | 'text.sm'
  | 'text.df'
  | 'text.lg';

export default class Theme {
  readonly contrast: ContrastLevel;

  readonly mixins: Mixins;

  readonly scheme: ColorScheme;

  readonly tokens: Tokens;

  constructor(options: ThemeOptions, tokens: Tokens, parentMixins?: Mixins) {
    this.contrast = options.contrast;
    this.scheme = options.scheme;
    this.tokens = tokens;
    this.mixins = parentMixins ?? this.createMixins();
  }

  extend(tokens: DeepPartial<ThemeTokens>, options: Partial<ThemeOptions> = {}): Theme {
    return new Theme(
      {
        contrast: this.contrast,
        scheme: this.scheme,
        ...options,
      },
      deepMerge(true, {}, this.tokens, tokens),
      this.mixins,
    );
  }

  mixin(path: MixinTarget, properties: DeclarationBlock, overwrite: boolean = false): this {
    interface AnyObject {
      // eslint-disable-next-line
      [key: string]: any;
    }

    const paths = path.split('.');
    let parent: AnyObject = this.mixins;
    let target: AnyObject = this.mixins;
    let key = '';

    while (paths.length > 0) {
      key = paths.shift()!;
      parent = target;
      target = target[key] as AnyObject;

      if (__DEV__) {
        if (target === undefined || typeof target !== 'object') {
          throw new Error(`Unknown mixin "${path}".`);
        }
      }
    }

    if (overwrite) {
      parent[key] = { ...properties };
    } else {
      parent[key] = deepMerge(true, {}, target, properties);
    }

    return this;
  }

  protected createMixins(): Mixins {
    const { border, heading, text } = this.tokens;

    // @ts-ignore
    return {
      border: {
        sm: mixins.border(border.sm),
        df: mixins.border(border.df),
        lg: mixins.border(border.lg),
      },
      // box: {},
      heading: {
        l1: mixins.heading(heading.l1),
        l2: mixins.heading(heading.l2),
        l3: mixins.heading(heading.l3),
        l4: mixins.heading(heading.l4),
        l5: mixins.heading(heading.l5),
        l6: mixins.heading(heading.l6),
      },
      // input: {},
      // state: {},
      text: {
        sm: mixins.text(text.sm),
        df: mixins.text(text.df),
        lg: mixins.text(text.lg),
      },
      typography: {
        break: mixins.typographyBreak(),
        root: mixins.typographyRoot(),
        truncate: mixins.typographyTruncate(),
        wrap: mixins.typographyWrap(),
      },
      ui: {
        hidden: mixins.hidden(),
        hiddenOffscreen: mixins.hiddenOffscreen(),
        resetButton: mixins.resetButton(),
        resetInput: mixins.resetInput(),
        resetList: mixins.resetList(),
        resetTypography: mixins.resetTypography(),
      },
    };
  }
}
