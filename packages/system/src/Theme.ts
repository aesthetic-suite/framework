/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import { Rule } from '@aesthetic/types';
import { deepClone, deepMerge, hyphenate, isObject, objectLoop } from '@aesthetic/utils';
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

interface AnyObject {
  [key: string]: any;
}

export default class Theme {
  name: string = '';

  readonly contrast: ContrastLevel;

  readonly scheme: ColorScheme;

  protected mixins: Record<string, MixinUtil<AnyObject>> = {};

  protected mixinTemplates: Record<string, MixinTemplate<AnyObject>> = {};

  protected tokens: ThemeTokens;

  private cachedTokens?: Tokens;

  private cachedVariables?: Variables;

  private design: Design;

  constructor(
    options: ThemeOptions,
    tokens: ThemeTokens,
    design: Design,
    parentTemplates: Record<string, MixinTemplate<AnyObject>> = {},
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
      deepClone(this.mixins),
    );
  }

  /**
   * Extend a mixin with additional CSS properties, and return the new mixin.
   */
  extendMixin<K extends keyof MixinUtils>(type: K, properties: Rule): Rule {
    return {};
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
    return ({
      mixin: this.mixins,
      unit: this.unit,
      var: this.var,
    } as unknown) as Utilities;
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

  protected registerMixin<K extends keyof MixinUtils>(type: K, mixin: MixinUtils[K]): this {
    this.mixins[type] = (options, properties) =>
      deepMerge((mixin as Function).call(this.toUtilities(), options), properties);

    return this;
  }
}
