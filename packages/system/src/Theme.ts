import { DeclarationBlock } from '@aesthetic/sss';
import { deepClone, deepMerge, hyphenate, isObject, objectLoop, toArray } from '@aesthetic/utils';
import Design from './Design';
import {
  ColorScheme,
  ContrastLevel,
  ThemeOptions,
  Tokens,
  DeepPartial,
  ThemeTokens,
  Mixins,
  MixinName,
  Variables,
  VarUtil,
  UnitUtil,
  MixinUtil,
  Utilities,
} from './types';
import createMixins from './createMixins';

interface AnyObject {
  // eslint-disable-next-line
  [key: string]: any;
}

export default class Theme {
  name: string = '';

  readonly contrast: ContrastLevel;

  readonly mixins: Mixins;

  readonly scheme: ColorScheme;

  readonly tokens: ThemeTokens;

  private cachedTokens?: Tokens;

  private cachedVariables?: Variables;

  private design: Design;

  constructor(options: ThemeOptions, tokens: ThemeTokens, design: Design, parentMixins?: Mixins) {
    this.contrast = options.contrast;
    this.scheme = options.scheme;
    this.design = design;
    this.tokens = tokens;
    this.mixins = parentMixins ?? createMixins(this.var);
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
  extendMixin(
    name: MixinName,
    properties?: DeclarationBlock,
    overwrite?: boolean,
  ): DeclarationBlock {
    const paths = name.split('-');
    let parent: AnyObject = this.mixins;
    let target: AnyObject = this.mixins;
    let key = '';

    while (paths.length > 0) {
      key = paths.shift()!;
      parent = target;
      target = parent[key];

      if (__DEV__) {
        if (target === undefined || !isObject(target)) {
          throw new Error(`Unknown mixin "${name}".`);
        }
      }
    }

    if (overwrite) {
      parent[key] = { ...properties };
    } else if (properties) {
      parent[key] = deepMerge(target, properties);
    }

    return parent[key];
  }

  /**
   * Merge one or many mixins into the defined properties.
   * Properties take the highest precendence and will override mixin declarations.
   */
  mixin: MixinUtil<object> = (names, properties = {}) =>
    deepMerge(...toArray(names).map((name) => this.extendMixin(name)), properties);

  /**
   * Overwrite a mixin with a set of custom CSS properties, and return the new mixin.
   */
  overwriteMixin(name: MixinName, properties: DeclarationBlock): DeclarationBlock {
    return this.extendMixin(name, properties, true);
  }

  /**
   * Return both design and theme tokens.
   */
  toTokens(): Tokens {
    if (!this.cachedTokens) {
      this.cachedTokens = {
        ...this.design.tokens,
        ...this.tokens,
      };
    }

    return this.cachedTokens;
  }

  /**
   * Return a mapping of all theme specific utility methods.
   */
  toUtilities<T extends object>(): Utilities<T> {
    return ({
      mixin: this.mixin,
      unit: this.unit,
      var: this.var,
    } as unknown) as Utilities<T>;
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
}
