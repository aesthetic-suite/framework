/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react'; // Required for createStyler()
import isObject from './helpers/isObject';
import stripClassPrefix from './helpers/stripClassPrefix';
import Adapter from './Adapter';
import UnifiedSyntax from './UnifiedSyntax';
import withStyles, { WithStylesOptions } from './withStyles';
import { ClassName, StyleName, ThemeName, StyleSheetDefinition, UnifiedStyleSheet } from './types';

export interface AestheticOptions {
  defaultTheme: ThemeName;
  extendable: boolean;
  passThemeNameProp: boolean;
  passThemeProp: boolean;
  pure: boolean;
  stylesPropName: string;
  themePropName: string;
  unifiedSyntax: boolean;
}

export default class Aesthetic<
  Theme,
  StyleSheet,
  Declaration,
  ParsedStyleSheet = StyleSheet,
  ParsedDeclaration = Declaration
> {
  adapter: Adapter<StyleSheet, Declaration, ParsedStyleSheet, ParsedDeclaration>;

  cache: WeakMap<ParsedDeclaration[], ClassName> = new WeakMap();

  options: AestheticOptions = {
    defaultTheme: '',
    extendable: false,
    passThemeNameProp: true,
    passThemeProp: true,
    pure: false,
    stylesPropName: 'styles',
    themePropName: 'theme',
    unifiedSyntax: false,
  };

  parents: { [childStyleName: string]: StyleName } = {};

  styles: { [styleName: string]: StyleSheetDefinition<Theme, StyleSheet> } = {};

  themes: { [themeName: string]: Theme } = {};

  constructor(
    adapter: Adapter<StyleSheet, Declaration, ParsedStyleSheet, ParsedDeclaration>,
    options: Partial<AestheticOptions> = {},
  ) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.adapter = adapter;

    if (this.options.unifiedSyntax) {
      const syntax = new UnifiedSyntax<StyleSheet, Declaration>();

      this.adapter.unify(syntax);
      this.adapter.unifiedSyntax = syntax;
    }
  }

  /**
   * Return a stylesheet unique to an adapter.
   */
  createStyleSheet<Props>(
    styleName: StyleName,
    themeName: ThemeName = '',
    props: Props,
  ): ParsedStyleSheet {
    let styleSheet = this.getStyles(styleName, themeName, props);

    if (this.options.unifiedSyntax && this.adapter.unifiedSyntax) {
      styleSheet = this.adapter.unifiedSyntax.convert(styleSheet as UnifiedStyleSheet);
    }

    return this.adapter.create(styleSheet as StyleSheet, styleName);
  }

  /**
   * Factory to create styling related methods.
   */
  createStyler() /* infer */ {
    const self = this;

    return {
      style(
        styleSheet: StyleSheetDefinition<Theme, StyleSheet>,
        options: Partial<WithStylesOptions> = {},
      ): ReturnType<typeof withStyles> {
        return withStyles(self, styleSheet, options);
      },
      transform(...styles: ParsedDeclaration[]): ClassName {
        return self.transformStyles(styles);
      },
    };
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    parentThemeName: ThemeName,
    themeName: ThemeName,
    theme: Theme,
    globals?: StyleSheetDefinition<Theme, StyleSheet>,
  ): this {
    return this.registerTheme(
      themeName,
      this.adapter.merge(this.getTheme(parentThemeName), theme),
      globals,
    );
  }

  /**
   * Retrieve the defined style declarations. If the declaratin is a function,
   * execute it while passing the current theme and React props.
   */
  getStyles<Props>(
    styleName: StyleName,
    themeName: ThemeName = '',
    props: Props,
  ): StyleSheet | UnifiedStyleSheet {
    const parentStyleName = this.parents[styleName];
    let styleSheet = this.styles[styleName];

    if (process.env.NODE_ENV !== 'production') {
      if (!styleSheet) {
        throw new Error(`Styles do not exist for "${styleName}".`);
      }
    }

    // Extract from callback
    if (typeof styleSheet === 'function') {
      styleSheet = styleSheet(this.getTheme(themeName), props);
    }

    // Merge from parent
    if (parentStyleName) {
      styleSheet = this.adapter.merge(
        this.getStyles(parentStyleName, themeName, props),
        styleSheet,
      );
    }

    return styleSheet as StyleSheet | UnifiedStyleSheet;
  }

  /**
   * Return a themes style object or throw an error.
   */
  getTheme(themeName: ThemeName = ''): Theme {
    const { defaultTheme } = this.options;

    let theme = this.themes[themeName];

    if (!theme && defaultTheme) {
      theme = this.themes[defaultTheme];
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!theme) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return theme;
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(
    themeName: ThemeName,
    theme: Theme,
    globals?: StyleSheetDefinition<Theme, StyleSheet>,
  ): this {
    if (process.env.NODE_ENV !== 'production') {
      if (this.themes[themeName]) {
        throw new Error(`Theme "${themeName}" already exists.`);
      } else if (!isObject(theme)) {
        throw new TypeError(`Theme "${themeName}" must be a style object.`);
      } else if (!isObject(globals)) {
        throw new TypeError(`Global styles for "${themeName}" must be an object.`);
      }
    }

    // Register the theme
    this.themes[themeName] = theme;

    // Create global styles
    if (globals) {
      this.setStyles(':root', globals).transformStyles(
        Object.values(this.createStyleSheet(':root', themeName, {})),
      );
    }

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   */
  setStyles(
    styleName: StyleName,
    styleSheet: StyleSheetDefinition<Theme, StyleSheet>,
    extendFrom: StyleName = '',
  ): this {
    if (process.env.NODE_ENV !== 'production') {
      if (this.styles[styleName]) {
        throw new Error(`Styles have already been set for "${styleName}".`);
      } else if (!isObject(styleSheet) && typeof styleSheet !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be an object or function.`);
      }
    }

    this.styles[styleName] = styleSheet;

    if (extendFrom) {
      if (process.env.NODE_ENV !== 'production') {
        if (!this.styles[extendFrom]) {
          throw new Error(`Cannot extend from "${extendFrom}" as those styles do not exist.`);
        } else if (extendFrom === styleName) {
          throw new Error('Cannot extend styles from itself.');
        }
      }

      this.parents[styleName] = extendFrom;
    }

    return this;
  }

  /**
   * Execute the adapter transformer on the list of style declarations.
   */
  transformStyles(styles: ParsedDeclaration[]): ClassName {
    if (this.cache.has(styles)) {
      return this.cache.get(styles)!;
    }

    const classNames: ClassName[] = [];
    const toTransform: ParsedDeclaration[] = [];

    styles.forEach(style => {
      if (!style) {
        return;
      }

      if (typeof style === 'string' || typeof style === 'number') {
        classNames.push(
          ...String(style)
            .split(' ')
            .map(s => stripClassPrefix(s).trim()),
        );
      } else if (isObject(style)) {
        toTransform.push(style);
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error('Unsupported style type to transform.');
      }
    });

    if (toTransform.length > 0) {
      classNames.push(this.adapter.transform(...toTransform));
    }

    const className = classNames.join(' ').trim();

    this.cache.set(styles, className);

    return className;
  }
}
