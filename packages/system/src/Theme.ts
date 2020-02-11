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
  MixinTarget,
} from './types';

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

  /**
   * Extend and instantiate a new theme instance with customized tokens.
   */
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

  /**
   * Merge with or overwrite a mixin with a collection of properties.
   */
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
    return {
      border: {
        sm: mixins.border(this.tokens, 'sm'),
        df: mixins.border(this.tokens, 'df'),
        lg: mixins.border(this.tokens, 'lg'),
      },
      box: {
        sm: mixins.box(this.tokens, 'sm'),
        df: mixins.box(this.tokens, 'df'),
        lg: mixins.box(this.tokens, 'lg'),
      },
      heading: {
        l1: mixins.heading(this.tokens, 'l1'),
        l2: mixins.heading(this.tokens, 'l2'),
        l3: mixins.heading(this.tokens, 'l3'),
        l4: mixins.heading(this.tokens, 'l4'),
        l5: mixins.heading(this.tokens, 'l5'),
        l6: mixins.heading(this.tokens, 'l6'),
      },
      pattern: {
        hidden: mixins.hidden(),
        hiddenOffscreen: mixins.hiddenOffscreen(),
        resetButton: mixins.resetButton(),
        resetInput: mixins.resetInput(),
        resetList: mixins.resetList(),
        resetTypography: mixins.resetTypography(),
        textBreak: mixins.textBreak(),
        textTruncate: mixins.textTruncate(),
        textWrap: mixins.textWrap(),
      },
      shadow: {
        xs: mixins.shadow(this.tokens, 'xs'),
        sm: mixins.shadow(this.tokens, 'sm'),
        md: mixins.shadow(this.tokens, 'md'),
        lg: mixins.shadow(this.tokens, 'lg'),
        xl: mixins.shadow(this.tokens, 'xl'),
      },
      text: {
        sm: mixins.text(this.tokens, 'sm'),
        df: mixins.text(this.tokens, 'df'),
        lg: mixins.text(this.tokens, 'lg'),
      },
    };
  }
}
