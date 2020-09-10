/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import { Rule } from '@aesthetic/types';
import { deepMerge, hyphenate, isObject, objectLoop } from '@aesthetic/utils';
import Design from './Design';
import {
  ColorScheme,
  ContrastLevel,
  ThemeOptions,
  Tokens,
  DeepPartial,
  ThemeTokens,
  Variables,
  VarUtil,
  UnitUtil,
  MixinUtil,
  Utilities,
  MixinUtils,
  MixinTemplate,
  TokenUtil,
  MixinType,
} from './types';
import { background } from './mixins/background';
import { border } from './mixins/border';
import { hideCompletely, hideOffscreen, hideVisually } from './mixins/display';
import { foreground } from './mixins/foreground';
import { heading } from './mixins/heading';
import { resetButton, resetInput, resetList, resetMedia, resetTypography } from './mixins/reset';
import { root } from './mixins/root';
import { shadow } from './mixins/shadow';
import { text, textWrap, textTruncate, textBreak } from './mixins/text';

type AnyObject = Record<string, any>;
type MixinTemplates = Partial<Record<MixinType, Set<MixinTemplate<AnyObject>>>>;

export default class Theme {
  name: string = '';

  readonly contrast: ContrastLevel;

  readonly scheme: ColorScheme;

  protected mixins: Record<string, MixinUtil<AnyObject>> = {};

  protected mixinTemplates: MixinTemplates = {};

  protected tokens: ThemeTokens;

  private cachedTokens?: Tokens;

  private cachedVariables?: Variables;

  private design: Design;

  constructor(
    options: ThemeOptions,
    tokens: ThemeTokens,
    design: Design,
    parentTemplates: MixinTemplates = {},
  ) {
    this.contrast = options.contrast;
    this.scheme = options.scheme;
    this.design = design;
    this.tokens = tokens;
    this.mixinTemplates = parentTemplates;

    this.registerMixin('background', background)
      .registerMixin('border', border)
      .registerMixin('foreground', foreground)
      .registerMixin('heading', heading)
      .registerMixin('hideCompletely', hideCompletely)
      .registerMixin('hideOffscreen', hideOffscreen)
      .registerMixin('hideVisually', hideVisually)
      .registerMixin('resetButton', resetButton)
      .registerMixin('resetInput', resetInput)
      .registerMixin('resetList', resetList)
      .registerMixin('resetMedia', resetMedia)
      .registerMixin('resetTypography', resetTypography)
      .registerMixin('root', root)
      .registerMixin('shadow', shadow)
      .registerMixin('text', text)
      .registerMixin('textBreak', textBreak)
      .registerMixin('textTruncate', textTruncate)
      .registerMixin('textWrap', textWrap);
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
      { ...this.mixinTemplates },
    );
  }

  /**
   * Extend a mixin with additional CSS properties, and return the new mixin.
   */
  extendMixin(type: MixinType, template: MixinTemplate<AnyObject>): this {
    const set = this.mixinTemplates[type] || new Set();

    set.add(template);

    this.mixinTemplates[type] = set;

    return this;
  }

  /**
   * Return both design and theme tokens.
   */
  toTokens(): Tokens {
    if (!this.cachedTokens) {
      this.cachedTokens = {
        ...this.design.getTokens(),
        ...this.tokens,
      };
    }

    return this.cachedTokens;
  }

  /**
   * Return a mapping of all theme specific utility methods.
   */
  toUtilities(): Utilities {
    return {
      mixin: (this.mixins as unknown) as MixinUtils,
      token: this.token,
      unit: this.unit,
      var: this.var,
    };
  }

  /**
   * Return both design and theme tokens as a mapping of CSS variables.
   */
  toVariables(): Variables {
    if (this.cachedVariables) {
      return this.cachedVariables;
    }

    const vars: AnyObject = {};
    const collapseTree = (data: AnyObject, path: string[]) => {
      objectLoop(data, (value, key) => {
        const nextPath = [...path, hyphenate(key)];

        if (isObject(value)) {
          collapseTree(value, nextPath);
        } else {
          vars[nextPath.join('-')] = value;
        }
      });
    };

    collapseTree(this.toTokens(), []);

    this.cachedVariables = (vars as unknown) as Variables;

    return this.cachedVariables;
  }

  /**
   * Return a raw token value for the defined name.
   */
  token: TokenUtil = (name) => {
    const value = this.toVariables()[name];

    if (__DEV__) {
      if (value === undefined) {
        throw new Error(`Unknown token "${name}".`);
      }
    }

    return value || null;
  };

  /**
   * Return a `rem` unit equivalent for the current spacing type and unit.
   */
  unit: UnitUtil = (...multipliers) =>
    multipliers
      .map(
        (m) =>
          `${((this.design.spacingUnit * m) / this.design.rootTextSize)
            .toFixed(2)
            .replace('.00', '')}rem`,
      )
      .join(' ');

  /**
   * Return a CSS variable declaration with the defined name and fallbacks.
   */
  var: VarUtil = (name, ...fallbacks) =>
    fallbacks.length > 0 ? `var(${[`--${name}`, ...fallbacks].join(', ')})` : `var(--${name})`;

  /**
   * Register an internal mixin with a handler. When the handler is called,
   * it will create the mixin rule with the defined options, and rule for every
   * custom/extended mixin template. Before returning, all rules, including custom
   * user-land properties, will be deep merged.
   */
  protected registerMixin<K extends keyof MixinUtils>(type: K, mixin: MixinUtils[K]): this {
    this.mixins[type] = (options, properties) => {
      const rules = [this.callMixinOrTemplate(mixin, options)];
      const templates = this.mixinTemplates[hyphenate(type) as MixinType];

      if (templates) {
        templates.forEach((template) => {
          rules.push(this.callMixinOrTemplate(template, options));
        });
      }

      return deepMerge(...rules, properties);
    };

    return this;
  }

  /**
   * Call a mixin handler or template function with the defined options object.
   * Will set the "this" context to the utilities object, so that mixins can utilize them.
   */
  protected callMixinOrTemplate(mixin: MixinTemplate<any>, options: object): Rule {
    return mixin.call(this.toUtilities(), options);
  }
}
