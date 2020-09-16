/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */

import { Rule, Unit } from '@aesthetic/types';
import { deepMerge, hyphenate, isObject, objectLoop } from '@aesthetic/utils';
import Design from './Design';
import {
  ColorScheme,
  ContrastLevel,
  DeepPartial,
  MixinBuiltInUtils,
  MixinTemplate,
  MixinType,
  MixinUtil,
  MixinUtils,
  ThemeOptions,
  ThemeTokens,
  Tokens,
  Utilities,
  VariableName,
  Variables,
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
import { uiBox, uiInteractive } from './mixins/ui';

type AnyObject = Record<string, any>;
type MixinTemplates = Record<string, Set<MixinTemplate>>;

export default class Theme implements Utilities {
  name: string = '';

  readonly contrast: ContrastLevel;

  readonly mixin: MixinUtils;

  readonly scheme: ColorScheme;

  readonly tokens: Tokens;

  protected mixins: Record<string, MixinTemplate> = {};

  protected mixinTemplates: MixinTemplates = {};

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
    this.tokens = {
      ...design.tokens,
      ...tokens,
    };
    this.mixinTemplates = parentTemplates;

    // Bind instead of using anonymous functions since we need
    // to pass these around and define properties on them!
    this.mixin = this.prepareBuiltIns();
    this.token = this.token.bind(this);
    this.unit = this.unit.bind(this);
    this.var = this.var.bind(this);
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
   * Extend a registered mixin with additional CSS properties.
   */
  extendMixin(name: MixinType, template: MixinTemplate): this {
    this.mixinTemplates[name] = (this.mixinTemplates[name] || new Set()).add(template);

    return this;
  }

  /**
   * Register a mixin to provide reusable CSS properties.
   */
  registerMixin(name: MixinType, template: MixinTemplate): this {
    if (__DEV__) {
      if (this.mixins[name]) {
        throw new Error(`A mixin already exists for "${name}". Cannot overwrite.`);
      }
    }

    this.mixins[name] = template;

    return this;
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

    collapseTree(this.tokens, []);

    this.cachedVariables = (vars as unknown) as Variables;

    return this.cachedVariables;
  }

  /**
   * Return merged CSS properties from the defined mixin, all template overrides,
   * and the provided additional CSS properties.
   */
  mixinBase(name: MixinType, options: object = {}, ...additionalRules: Rule[]): Rule {
    const rules: Rule[] = [];
    const mixin = this.mixins[name];

    if (mixin) {
      rules.push(mixin.call(this, options));
    } else if (__DEV__) {
      // Log instead of error since mixins are dynamic
      // eslint-disable-next-line no-console
      console.warn(`Unknown mixin "${name}".`);
    }

    const templates = this.mixinTemplates[name];

    if (templates) {
      templates.forEach((template) => {
        rules.push(template.call(this, options));
      });
    }

    rules.push(...additionalRules);

    return rules.length === 0 ? {} : deepMerge(...rules);
  }

  /**
   * Return a raw token value for the defined name.
   */
  token(name: VariableName): unknown {
    const value = this.toVariables()[name];

    if (__DEV__) {
      if (value === undefined) {
        throw new Error(`Unknown token "${name}".`);
      }
    }

    return value || null;
  }

  /**
   * Return a `rem` unit equivalent for the current spacing type and unit.
   */
  unit(...multipliers: number[]): Unit {
    return multipliers
      .map(
        (m) =>
          `${((this.design.spacingUnit * m) / this.design.rootTextSize)
            .toFixed(2)
            .replace('.00', '')}rem`,
      )
      .join(' ');
  }

  /**
   * Return a CSS variable declaration with the defined name and fallbacks.
   */
  var(name: VariableName, ...fallbacks: (string | number)[]): string {
    return `var(${[`--${name}`, ...fallbacks].join(', ')})`;
  }

  /**
   * Set the built-in mixin's as properties on the mixin method for easy access.
   */
  protected prepareBuiltIns(): MixinUtils {
    const mixin = this.mixinBase.bind(this);
    const builtIns: Record<keyof MixinBuiltInUtils, MixinTemplate> = {
      background,
      border,
      foreground,
      heading,
      hideCompletely,
      hideOffscreen,
      hideVisually,
      resetButton,
      resetInput,
      resetList,
      resetMedia,
      resetTypography,
      root,
      shadow,
      text,
      textBreak,
      textTruncate,
      textWrap,
      uiBox,
      uiInteractive,
    };

    objectLoop(builtIns, (template, name) => {
      const type = hyphenate(name) as MixinType;

      // Register the mixin
      this.registerMixin(type, template);

      // Provide a utility function
      const util: MixinUtil = (options, properties) => mixin(type, options, properties!);

      Object.defineProperty(mixin, name, { value: util });
    });

    return mixin as MixinUtils;
  }
}
