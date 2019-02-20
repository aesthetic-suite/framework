/* eslint-disable max-classes-per-file, react/no-multi-comp */

import React, { useState, useLayoutEffect } from 'react';
import uuid from 'uuid/v4';
import hoistNonReactStatics from 'hoist-non-react-statics';
import deepMerge from 'extend';
import { Omit } from 'utility-types';
import isObject from './helpers/isObject';
import stripClassPrefix from './helpers/stripClassPrefix';
import StyleSheetManager from './StyleSheetManager';
import UnifiedSyntax from './UnifiedSyntax';
import {
  ClassName,
  ClassNameGenerator,
  GlobalSheetDefinition,
  SheetMap,
  StyledComponentClass,
  StyleName,
  StyleSheet,
  StyleSheetDefinition,
  ThemeName,
  WithStylesOptions,
  WithStylesProps,
  WithStylesState,
  WithStylesWrapperProps,
  WithThemeOptions,
  WithThemeProps,
  WithThemeWrapperProps,
} from './types';

export interface AestheticOptions {
  extendable: boolean;
  passThemeProp: boolean;
  pure: boolean;
  stylesPropName: string;
  theme: ThemeName;
  themePropName: string;
}

export default abstract class Aesthetic<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
> {
  cache: { [styleName: string]: SheetMap<ParsedBlock> } = {};

  globals: { [themeName: string]: GlobalSheetDefinition<Theme, any> } = {};

  options: AestheticOptions;

  parents: { [childStyleName: string]: StyleName } = {};

  styles: { [styleName: string]: StyleSheetDefinition<Theme, any> } = {};

  syntax: UnifiedSyntax<NativeBlock>;

  themes: { [themeName: string]: Theme } = {};

  protected appliedGlobals: boolean = false;

  protected sheetManager: StyleSheetManager | null = null;

  constructor(options: Partial<AestheticOptions> = {}) {
    this.options = {
      extendable: false,
      passThemeProp: false,
      pure: true,
      stylesPropName: 'styles',
      theme: 'default',
      themePropName: 'theme',
      ...options,
    };

    this.syntax = new UnifiedSyntax();
  }

  /**
   * Apply and inject global styles for the current theme.
   * This should only happen once!
   */
  applyGlobalStyles(): this {
    if (this.appliedGlobals) {
      return this;
    }

    const globalDef = this.globals[this.options.theme];
    const globalSheet = globalDef ? globalDef(this.getTheme()) : null;

    if (globalSheet) {
      const sheet = this.processStyleSheet(
        this.syntax.convertGlobalSheet(globalSheet).toObject(),
        ':root',
      );

      // Some adapters require the styles to be transformed to be flushed
      const styles: ParsedBlock[] = [];

      Object.keys(sheet).forEach(key => {
        styles.push(sheet[key]);
      });

      this.transformToClassName(styles);
    }

    this.appliedGlobals = true;
    this.flushStyles(':root');

    return this;
  }

  /**
   * Create and return a style sheet unique to an adapter.
   */
  createStyleSheet(styleName: StyleName): SheetMap<ParsedBlock> {
    if (this.cache[styleName]) {
      return this.cache[styleName];
    }

    this.applyGlobalStyles();

    const baseSheet = this.syntax.convertStyleSheet(this.getStyleSheet(styleName), styleName);
    const styleSheet = this.processStyleSheet(baseSheet.toObject(), styleName);

    this.cache[styleName] = {
      ...styleSheet,
      ...baseSheet.classNames,
    } as SheetMap<ParsedBlock>;

    return this.cache[styleName];
  }

  /**
   * Compose and extend multiple stylesheets to create 1 stylesheet.
   */
  extendStyles(
    ...styleSheets: StyleSheetDefinition<Theme, any>[]
  ): StyleSheetDefinition<Theme, any> {
    return (theme: Theme) => {
      const sheets = styleSheets.map(sheet => sheet(theme));

      return deepMerge(true, {}, ...sheets);
    };
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme<T>(
    themeName: ThemeName,
    parentThemeName: ThemeName,
    theme: Partial<Theme>,
    globalSheet: GlobalSheetDefinition<Theme, T> = null,
  ): this {
    return this.registerTheme(
      themeName,
      deepMerge(true, {}, this.getTheme(parentThemeName), theme),
      globalSheet || this.globals[parentThemeName],
    );
  }

  /**
   * Flush parsed styles and inject them into the DOM.
   */
  flushStyles(styleName: StyleName) {}

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme<T>(
    themeName: ThemeName,
    theme: Theme,
    globalSheet: GlobalSheetDefinition<Theme, T> = null,
  ): this {
    if (__DEV__) {
      if (this.themes[themeName]) {
        throw new Error(`Theme "${themeName}" already exists.`);
      } else if (!isObject(theme)) {
        throw new TypeError(`Theme "${themeName}" must be a style object.`);
      }
    }

    this.themes[themeName] = theme;
    this.globals[themeName] = this.validateDefinition(themeName, globalSheet, this.globals);

    return this;
  }

  /**
   * Transform the list of style declarations to a list of class name.
   */
  transformStyles = (
    ...styles: (undefined | false | ClassName | NativeBlock | ParsedBlock)[]
  ): ClassName => {
    const classNames: ClassName[] = [];
    const toTransform: (NativeBlock | ParsedBlock)[] = [];

    styles.forEach(style => {
      if (!style) {
        return;
      }

      if (typeof style === 'string') {
        classNames.push(
          ...String(style)
            .split(' ')
            .map(s => stripClassPrefix(s).trim()),
        );
      } else if (isObject(style)) {
        toTransform.push(style);
      } else if (__DEV__) {
        throw new Error('Unsupported style type to transform.');
      }
    });

    if (toTransform.length > 0) {
      classNames.push(this.transformToClassName(toTransform));
    }

    return classNames.join(' ').trim();
  };

  /**
   * Hook within a component to provide a style sheet.
   */
  useStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    customName: string = 'Component',
  ): [SheetMap<ParsedBlock>, ClassNameGenerator<NativeBlock, ParsedBlock>, string] {
    const [styleName] = useState(() => {
      const name = `${customName}-${uuid()}`;

      this.setStyleSheet(name, styleSheet);

      return name;
    });

    const sheet = this.createStyleSheet(styleName);

    // Flush styles on mount
    let flushed = false;

    useLayoutEffect(() => {
      this.flushStyles(styleName);
      flushed = true;
    }, [flushed]);

    return [sheet, this.transformStyles, styleName];
  }

  /**
   * Hook within a component to provide the current theme object.
   */
  useTheme(): Theme {
    return this.getTheme();
  }

  /**
   * Wrap a React component with an HOC that injects the defined style sheet as a prop.
   */
  withStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    options: WithStylesOptions = {},
  ) /* infer */ {
    const aesthetic = this;
    const {
      extendable = this.options.extendable,
      extendFrom = '',
      passThemeProp = this.options.passThemeProp,
      pure = this.options.pure,
      stylesPropName = this.options.stylesPropName,
      themePropName = this.options.themePropName,
    } = options;

    return function withStylesFactory<Props extends object = {}>(
      WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
    ): StyledComponentClass<Theme, Props & WithStylesWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const styleName = `${baseName}-${uuid()}`;
      const Component = pure ? React.PureComponent : React.Component;

      type OwnState = WithStylesState<Props, ParsedBlock>;

      aesthetic.setStyleSheet(styleName, styleSheet, extendFrom);

      class WithStyles extends Component<Props & WithStylesWrapperProps, OwnState> {
        static displayName = `withStyles(${baseName})`;

        static styleName = styleName;

        static WrappedComponent = WrappedComponent;

        static extendStyles<ET>(
          customStyleSheet: StyleSheetDefinition<Theme, ET>,
          extendOptions: Omit<WithStylesOptions, 'extendFrom'> = {},
        ) {
          if (__DEV__) {
            if (!extendable) {
              throw new Error(`${baseName} is not extendable.`);
            }
          }

          return aesthetic.withStyles(customStyleSheet, {
            ...options,
            ...extendOptions,
            extendFrom: styleName,
          })(WrappedComponent);
        }

        state: OwnState = {
          styles: aesthetic.createStyleSheet(styleName),
        };

        componentDidMount() {
          aesthetic.flushStyles(styleName);
        }

        render() {
          const { wrappedRef, ...props } = this.props;
          const extraProps: WithStylesProps<Theme, ParsedBlock> = {
            [stylesPropName as 'styles']: this.state.styles,
            ref: wrappedRef,
          };

          if (passThemeProp) {
            extraProps[themePropName as 'theme'] = aesthetic.getTheme();
          }

          return <WrappedComponent {...props as any} {...extraProps} />;
        }
      }

      hoistNonReactStatics(WithStyles, WrappedComponent);

      return WithStyles;
    };
  }

  /**
   * Wrap a React component with an HOC that injects the current theme object as a prop.
   */
  withTheme(options: WithThemeOptions = {}) /* infer */ {
    const aesthetic = this;
    const { pure = this.options.pure, themePropName = this.options.themePropName } = options;

    return function withThemeFactory<Props extends object = {}>(
      WrappedComponent: React.ComponentType<Props & WithThemeProps<Theme>>,
    ): React.ComponentClass<Props & WithThemeWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const Component = pure ? React.PureComponent : React.Component;

      class WithTheme extends Component<Props & WithThemeWrapperProps> {
        static displayName = `withTheme(${baseName})`;

        static WrappedComponent = WrappedComponent;

        render() {
          const { wrappedRef, ...props } = this.props;
          const extraProps: WithThemeProps<Theme> = {
            [themePropName as 'theme']: aesthetic.getTheme(),
            ref: wrappedRef,
          };

          return <WrappedComponent {...props as any} {...extraProps} />;
        }
      }

      hoistNonReactStatics(WithTheme, WrappedComponent);

      return WithTheme;
    };
  }

  /**
   * Retrieve the defined component styles. If the definition is a function,
   * execute it while passing the current theme and React props.
   */
  protected getStyleSheet(styleName: StyleName): StyleSheet {
    const parentStyleName = this.parents[styleName];
    const styleDef = this.styles[styleName];
    const styleSheet = styleDef(this.getTheme());

    // Merge from parent
    if (parentStyleName) {
      return deepMerge(true, {}, this.getStyleSheet(parentStyleName), styleSheet);
    }

    return styleSheet;
  }

  /**
   * Return a native style sheet manager used for injecting CSS.
   */
  protected getStyleSheetManager(): StyleSheetManager {
    if (this.sheetManager) {
      return this.sheetManager;
    }

    this.sheetManager = new StyleSheetManager();

    return this.sheetManager;
  }

  /**
   * Return a theme object or throw an error.
   */
  protected getTheme(customTheme: ThemeName = ''): Theme {
    const themeName = customTheme || this.options.theme;
    const theme = this.themes[themeName];

    if (__DEV__) {
      if (!theme || !isObject(theme)) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return theme;
  }

  /**
   * Process from an Aesthetic style sheet to an adapter native style sheet.
   */
  protected processStyleSheet(
    styleSheet: SheetMap<NativeBlock>,
    styleName: StyleName,
  ): SheetMap<ParsedBlock> {
    // @ts-ignore Allow spread
    return { ...styleSheet };
  }

  /**
   * Set a style sheet definition for a component.
   */
  protected setStyleSheet(
    styleName: StyleName,
    styleSheet: StyleSheetDefinition<Theme, any>,
    extendFrom: StyleName = '',
  ): this {
    if (extendFrom) {
      if (__DEV__) {
        if (!this.styles[extendFrom]) {
          throw new Error(`Cannot extend from "${extendFrom}" as those styles do not exist.`);
        } else if (extendFrom === styleName) {
          throw new Error('Cannot extend styles from itself.');
        }
      }

      this.parents[styleName] = extendFrom;
    }

    this.styles[styleName] = this.validateDefinition(styleName, styleSheet, this.styles);

    return this;
  }

  /**
   * Transform the styles into CSS class names.
   */
  protected abstract transformToClassName(styles: (NativeBlock | ParsedBlock)[]): ClassName;

  /**
   * Validate a style sheet or theme definition.
   */
  private validateDefinition<T>(key: string, value: T, cache: { [key: string]: T }): T {
    if (__DEV__) {
      if (cache[key]) {
        throw new Error(`Styles have already been defined for "${key}".`);
      } else if (value !== null && typeof value !== 'function') {
        throw new TypeError(`Definition for "${key}" must be null or a function.`);
      }
    }

    return value;
  }
}
