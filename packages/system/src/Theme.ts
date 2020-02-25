import { deepMerge, hyphenate, isObject, objectLoop, toArray } from '@aesthetic/utils';
import Design from './Design';
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
  Variables,
  VarFactory,
  UnitFactory,
  MixinFactory,
} from './types';

interface AnyObject {
  // eslint-disable-next-line
  [key: string]: any;
}

export default class Theme {
  readonly contrast: ContrastLevel;

  readonly mixins: Mixins;

  readonly scheme: ColorScheme;

  readonly tokens: ThemeTokens;

  private design: Design;

  constructor(options: ThemeOptions, tokens: ThemeTokens, design: Design, parentMixins?: Mixins) {
    this.contrast = options.contrast;
    this.scheme = options.scheme;
    this.design = design;
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
      deepMerge(this.tokens, tokens),
      this.design,
      this.mixins,
    );
  }

  /**
   * Merge one or many mixins into the defined properties.
   * Properties take the highest precendence and will override mixin declarations.
   */
  mixin: MixinFactory = (targets, properties) =>
    deepMerge(...toArray(targets).map(target => this.getMixin(target)), properties);

  /**
   * Return both design and theme tokens.
   */
  toTokens(): Tokens {
    return {
      ...this.design.tokens,
      ...this.tokens,
    };
  }

  /**
   * Return both design and theme tokens as a mapping of CSS variables.
   */
  toVariables(): Variables {
    const vars: AnyObject = {};

    const collapseTree = (data: AnyObject, path: string[]) => {
      objectLoop(data, (value, key) => {
        if (isObject(value)) {
          collapseTree(value, [...path, hyphenate(key)]);
        } else {
          vars[[...path, key].join('-')] = value;
        }
      });
    };

    collapseTree(this.toTokens(), []);

    return (vars as unknown) as Variables;
  }

  /**
   * Return a `rem` unit equivalent for the current spacing type and unit.
   */
  unit: UnitFactory = (...multipliers) =>
    multipliers
      .map(
        m =>
          `${((this.design.spacingUnit * m) / this.design.rootTextSize)
            .toFixed(2)
            .replace('.00', '')}rem`,
      )
      .join(' ');

  /**
   * Return a CSS variable declaration with the defined name and fallbacks.
   */
  var: VarFactory = (name, ...fallbacks) => `var(${[`--${name}`, ...fallbacks].join(', ')})`;

  /**
   * Create the entire mapping of all mixins.
   */
  protected createMixins(): Mixins {
    return {
      border: {
        sm: mixins.border(this.var, 'sm'),
        df: mixins.border(this.var, 'df'),
        lg: mixins.border(this.var, 'lg'),
      },
      box: {
        sm: mixins.box(this.var, 'sm'),
        df: mixins.box(this.var, 'df'),
        lg: mixins.box(this.var, 'lg'),
      },
      heading: {
        l1: mixins.heading(this.var, 'l1'),
        l2: mixins.heading(this.var, 'l2'),
        l3: mixins.heading(this.var, 'l3'),
        l4: mixins.heading(this.var, 'l4'),
        l5: mixins.heading(this.var, 'l5'),
        l6: mixins.heading(this.var, 'l6'),
      },
      pattern: {
        hidden: mixins.hidden(),
        offscreen: mixins.hiddenOffscreen(),
        reset: {
          button: mixins.resetButton(),
          input: mixins.resetInput(),
          list: mixins.resetList(),
          typography: mixins.resetTypography(),
        },
        text: {
          break: mixins.textBreak(),
          truncate: mixins.textTruncate(),
          wrap: mixins.textWrap(),
        },
      },
      shadow: {
        xs: mixins.shadow(this.var, 'xs'),
        sm: mixins.shadow(this.var, 'sm'),
        md: mixins.shadow(this.var, 'md'),
        lg: mixins.shadow(this.var, 'lg'),
        xl: mixins.shadow(this.var, 'xl'),
      },
      text: {
        sm: mixins.text(this.var, 'sm'),
        df: mixins.text(this.var, 'df'),
        lg: mixins.text(this.var, 'lg'),
      },
    };
  }

  /**
   * Drill down and return the mixing at the defined target path.
   */
  protected getMixin(path: MixinTarget): AnyObject {
    const paths = path.split('-');
    let target: AnyObject = this.mixins;
    let key = '';

    while (paths.length > 0) {
      key = paths.shift()!;
      target = target[key];

      if (__DEV__) {
        if (target === undefined || !isObject(target)) {
          throw new Error(`Unknown mixin "${path}".`);
        }
      }
    }

    return target;
  }
}
