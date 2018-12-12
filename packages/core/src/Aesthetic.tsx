/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import uuid from 'uuid/v4';
import hoistNonReactStatics from 'hoist-non-react-statics';
import shallowEqual from 'shallowequal';
import deepMerge from 'extend';
import isObject from './helpers/isObject';
import stripClassPrefix from './helpers/stripClassPrefix';
import UnifiedSyntax from './UnifiedSyntax';
import {
  Omit,
  ClassName,
  StyleName,
  ThemeName,
  StyleSheet,
  StyleSheetDefinition,
  SheetMap,
  StyledComponent,
  WithStylesOptions,
  WithStylesProps,
  WithStylesWrapperProps,
  WithStylesState,
  GlobalSheetDefinition,
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

  globals: { [themeName: string]: GlobalSheetDefinition<Theme> } = {};

  options: AestheticOptions;

  parents: { [childStyleName: string]: StyleName } = {};

  styles: { [styleName: string]: StyleSheetDefinition<Theme> } = {};

  syntax: UnifiedSyntax<NativeBlock>;

  themes: { [themeName: string]: Theme } = {};

  protected appliedGlobals: boolean = false;

  constructor(options: Partial<AestheticOptions> = {}) {
    this.options = {
      extendable: false,
      passThemeProp: true,
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
      this.processStyleSheet(this.syntax.convertGlobalSheet(globalSheet).toObject(), ':root');
    }

    this.appliedGlobals = true;
    this.flushStyles(':root');

    return this;
  }

  /**
   * Create and return a stylesheet unique to an adapter.
   */
  createStyleSheet(styleName: StyleName, props: object = {}): SheetMap<ParsedBlock> {
    if (this.cache[styleName]) {
      return this.cache[styleName];
    }

    this.applyGlobalStyles();

    const styleSheet = this.processStyleSheet(
      this.syntax.convertStyleSheet(this.getStyles(styleName, props)).toObject(),
      styleName,
    );

    this.cache[styleName] = styleSheet;

    return styleSheet;
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    themeName: ThemeName,
    parentThemeName: ThemeName,
    theme: Partial<Theme>,
    globalSheet: GlobalSheetDefinition<Theme> = null,
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
   * Retrieve the defined component styles. If the definition is a function,
   * execute it while passing the current theme and React props.
   */
  getStyles(styleName: StyleName, props: object = {}): StyleSheet {
    const parentStyleName = this.parents[styleName];
    const styleDef = this.styles[styleName];
    const styleSheet = styleDef ? styleDef(this.getTheme(), props) : {};

    // Merge from parent
    if (parentStyleName) {
      return deepMerge(true, {}, this.getStyles(parentStyleName, props), styleSheet);
    }

    return styleSheet;
  }

  /**
   * Return a theme object or throw an error.
   */
  getTheme(customTheme: ThemeName = ''): Theme {
    const themeName = customTheme || this.options.theme;
    const theme = this.themes[themeName];

    if (process.env.NODE_ENV !== 'production') {
      if (!theme || !isObject(theme)) {
        throw new Error(`Theme "${themeName}" does not exist.`);
      }
    }

    return theme;
  }

  /**
   * Process from an Aesthetic style sheet to an adapter native style sheet.
   */
  processStyleSheet(
    styleSheet: SheetMap<NativeBlock>,
    styleName: StyleName,
  ): SheetMap<ParsedBlock> {
    // @ts-ignore Allow spread
    return { ...styleSheet };
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(
    themeName: ThemeName,
    theme: Theme,
    globalSheet: GlobalSheetDefinition<Theme> = null,
  ): this {
    if (process.env.NODE_ENV !== 'production') {
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
   * Set multiple style declarations for a component.
   */
  setStyles(
    styleName: StyleName,
    styleSheet: StyleSheetDefinition<Theme>,
    extendFrom: StyleName = '',
  ): this {
    this.styles[styleName] = this.validateDefinition(styleName, styleSheet, this.styles);

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
   * Transform the list of style declarations to a list of class name.
   */
  transformStyles(
    ...styles: (undefined | false | ClassName | NativeBlock | ParsedBlock)[]
  ): ClassName {
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
      } else if (process.env.NODE_ENV !== 'production') {
        throw new Error('Unsupported style type to transform.');
      }
    });

    if (toTransform.length > 0) {
      classNames.push(this.transformToClassName(toTransform));
    }

    return classNames.join(' ').trim();
  }

  /**
   * Transform the styles into CSS class names.
   */
  abstract transformToClassName(styles: (NativeBlock | ParsedBlock)[]): ClassName;

  /**
   * Wrap a React component with an HOC that handles the entire styling, converting,
   * and transforming process.
   */
  withStyles<P>(
    styleSheet: StyleSheetDefinition<Theme, P>,
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

    return function withStylesFactory<Props extends object>(
      WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
    ): StyledComponent<Theme, Props & WithStylesWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const styleName = `${baseName}-${uuid()}`;
      const Component = pure ? React.PureComponent : React.Component;

      type OwnState = WithStylesState<Props, ParsedBlock>;

      aesthetic.setStyles(styleName, styleSheet, extendFrom);

      class WithStyles extends Component<Props & WithStylesWrapperProps, OwnState> {
        static displayName = `withAesthetic(${baseName})`;

        static styleName = styleName;

        static WrappedComponent = WrappedComponent;

        static extendStyles(
          customStyleSheet: StyleSheetDefinition<Theme, Props>,
          extendOptions: Omit<WithStylesOptions, 'extendFrom'> = {},
        ) {
          if (process.env.NODE_ENV !== 'production') {
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

        static getDerivedStateFromProps(
          props: Readonly<Props>,
          state: OwnState,
        ): Partial<OwnState> | null {
          if (shallowEqual(props, state.props)) {
            return null;
          }

          return {
            props,
            styles: aesthetic.createStyleSheet(styleName, {
              ...WrappedComponent.defaultProps,
              ...props,
            }),
          };
        }

        state = {
          styles: {},
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

  private validateDefinition<T>(key: string, value: T, cache: { [key: string]: T }): T {
    if (process.env.NODE_ENV !== 'production') {
      if (cache[key]) {
        throw new Error(`Styles have already been defined for "${key}".`);
      } else if (value !== null && typeof value !== 'function') {
        throw new TypeError(`Definition for "${key}" must be null or a function.`);
      }
    }

    return value;
  }
}
