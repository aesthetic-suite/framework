/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import uuid from 'uuid/v4';
import hoistNonReactStatics from 'hoist-non-react-statics';
import deepMerge from 'lodash/merge';
import isObject from './helpers/isObject';
import stripClassPrefix from './helpers/stripClassPrefix';
import UnifiedSyntax from './UnifiedSyntax';
import {
  Omit,
  ClassName,
  StyleName,
  ThemeName,
  ComponentStyleSheet,
  StyleSheetDefinition,
  StyleSheetMap,
  StyledComponent,
  WithStylesOptions,
  WithStylesProps,
  WithStylesWrapperProps,
  WithStylesState,
  GlobalSheetDefinition,
} from './types';

export interface AestheticOptions {
  defaultTheme: ThemeName;
  extendable: boolean;
  passThemeNameProp: boolean;
  passThemeProp: boolean;
  pure: boolean;
  stylesPropName: string;
  themePropName: string;
}

export default abstract class Aesthetic<Theme, NativeBlock, ParsedBlock = NativeBlock> {
  cache: WeakMap<any[], ClassName> = new WeakMap();

  globals: { [themeName: string]: GlobalSheetDefinition<Theme> } = {};

  options: AestheticOptions;

  parents: { [childStyleName: string]: StyleName } = {};

  styles: { [styleName: string]: StyleSheetDefinition<Theme> } = {};

  syntax: UnifiedSyntax<NativeBlock>;

  themes: { [themeName: string]: Theme } = {};

  constructor(options: Partial<AestheticOptions> = {}) {
    this.options = {
      defaultTheme: '',
      extendable: false,
      passThemeNameProp: true,
      passThemeProp: true,
      pure: false,
      stylesPropName: 'styles',
      themePropName: 'theme',
      ...options,
    };

    this.syntax = new UnifiedSyntax();
  }

  /**
   * Create and return a stylesheet unique to an adapter.
   */
  createStyleSheet(
    styleName: StyleName,
    themeName: ThemeName,
    props: any = {},
  ): StyleSheetMap<ParsedBlock> {
    return this.processStyleSheet(
      this.syntax.convertStyleSheet(this.getStyles(styleName, themeName, props)).toObject(),
      styleName,
    );
  }

  /**
   * Register a theme by extending and merging with a previously defined theme.
   */
  extendTheme(
    parentThemeName: ThemeName,
    themeName: ThemeName,
    theme: Theme,
    globals?: StyleSheetDefinition<Theme>,
  ): this {
    return this.registerTheme(
      themeName,
      deepMerge({}, this.getTheme(parentThemeName), theme),
      globals,
    );
  }

  /**
   * Retrieve the defined component styles. If the definition is a function,
   * execute it while passing the current theme and React props.
   */
  getStyles(styleName: StyleName, themeName: ThemeName, props: any = {}): ComponentStyleSheet {
    const parentStyleName = this.parents[styleName];
    const styleDef = this.styles[styleName];
    const styleSheet = styleDef ? styleDef(this.getTheme(themeName), props) : {};

    // Merge from parent
    if (parentStyleName) {
      return deepMerge({}, this.getStyles(parentStyleName, themeName, props), styleSheet);
    }

    return styleSheet;
  }

  /**
   * Return a theme object or throw an error.
   */
  getTheme(themeName: ThemeName): Theme {
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
   * Process from an Aesthetic style sheet to an adapter native style sheet.
   */
  processStyleSheet(styleSheet: object, styleName: StyleName): StyleSheetMap<ParsedBlock> {
    return { ...styleSheet };
  }

  /**
   * Register a theme with a pre-defined set of theme settings.
   */
  registerTheme(
    themeName: ThemeName,
    theme: Theme,
    globals: GlobalSheetDefinition<Theme> = null,
  ): this {
    if (process.env.NODE_ENV !== 'production') {
      if (this.themes[themeName]) {
        throw new Error(`Theme "${themeName}" already exists.`);
      } else if (!isObject(theme)) {
        throw new TypeError(`Theme "${themeName}" must be a style object.`);
      } else if (globals !== null && typeof globals !== 'function') {
        throw new TypeError(`Global styles for "${themeName}" must be a function.`);
      }
    }

    // Register the theme
    this.themes[themeName] = theme;

    // Set global styles
    this.setStyles(themeName, globals, '', true);

    return this;
  }

  /**
   * Set multiple style declarations for a component.
   */
  setStyles(
    styleName: StyleName,
    styleSheet: StyleSheetDefinition<Theme> | GlobalSheetDefinition<Theme>,
    extendFrom: StyleName = '',
    global: boolean = false,
  ): this {
    if (process.env.NODE_ENV !== 'production') {
      if (this.styles[styleName]) {
        throw new Error(`Styles have already been set for "${styleName}".`);
      } else if (styleSheet !== null && typeof styleSheet !== 'function') {
        throw new TypeError(`Styles defined for "${styleName}" must be a function.`);
      }
    }

    if (global) {
      this.globals[styleName] = styleSheet as GlobalSheetDefinition<Theme>;
    } else {
      this.styles[styleName] = styleSheet as StyleSheetDefinition<Theme>;
    }

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
  transformStyles(...styles: (ClassName | NativeBlock | ParsedBlock)[]): ClassName {
    if (this.cache.has(styles)) {
      return this.cache.get(styles)!;
    }

    const classNames: ClassName[] = [];
    const toTransform: (NativeBlock | ParsedBlock)[] = [];

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
      classNames.push(this.transformToClassName(toTransform));
    }

    const className = classNames.join(' ').trim();

    this.cache.set(styles, className);

    return className;
  }

  /**
   * Transform the style declarations into CSS class names.
   */
  abstract transformToClassName(styles: (NativeBlock | ParsedBlock)[]): ClassName;

  /**
   * Wrap a React component with an HOC that handles the entire styling, converting,
   * and transforming process.
   */
  withStyles<P>(
    styleSheet: StyleSheetDefinition<Theme, P>,
    options: Partial<WithStylesOptions> = {},
  ) {
    const aesthetic = this;
    const {
      extendable = this.options.extendable,
      extendFrom = '',
      passThemeNameProp = this.options.passThemeNameProp,
      passThemeProp = this.options.passThemeProp,
      pure = this.options.pure,
      stylesPropName = this.options.stylesPropName,
      themePropName = this.options.themePropName,
    } = options;

    return function<Props>(
      WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
    ): StyledComponent<Theme, Props & WithStylesWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const styleName = `${baseName}-${uuid()}`;
      const Component = pure ? React.PureComponent : React.Component;

      aesthetic.setStyles(styleName, styleSheet, extendFrom);

      class WithStyles extends Component<
        Props & WithStylesWrapperProps,
        WithStylesState<ParsedBlock>
      > {
        // @ts-ignore
        static contextType = ThemeContext;

        static displayName = `withAesthetic(${baseName})`;

        static styleName = styleName;

        static WrappedComponent = WrappedComponent;

        static extendStyles(
          customStyleSheet: StyleSheetDefinition<Theme, Props>,
          extendOptions: Partial<Omit<WithStylesOptions, 'extendFrom'>> = {},
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

        state = this.transformStyles(this.getThemeName(this.props));

        componentDidUpdate(prevProps: WithStylesWrapperProps) {
          const themeName = this.getThemeName(this.props);

          if (themeName !== this.getThemeName(prevProps)) {
            this.setState(this.transformStyles(themeName));
          }
        }

        getThemeName(props: WithStylesWrapperProps): ThemeName {
          return props.themeName || this.context || aesthetic.options.defaultTheme || '';
        }

        getWrappedProps(): Props {
          return {
            // @ts-ignore
            ...WrappedComponent.defaultProps,
            ...this.props,
          };
        }

        transformStyles(themeName: ThemeName): WithStylesState<ParsedBlock> {
          return {
            styles: aesthetic.createStyleSheet(styleName, themeName, this.getWrappedProps()),
            themeName,
          };
        }

        render() {
          const { state } = this;
          // @ts-ignore Allow rest
          const { themeName, wrappedRef, ...props } = this.props;
          const extraProps: WithStylesProps<Theme, ParsedBlock> = {
            [stylesPropName as 'styles']: state.styles,
          };

          if (passThemeProp) {
            extraProps[themePropName as 'theme'] = aesthetic.getTheme(state.themeName);
          }

          if (passThemeNameProp) {
            extraProps.themeName = state.themeName;
          }

          if (wrappedRef) {
            extraProps.ref = wrappedRef;
          }

          return <WrappedComponent {...props} {...extraProps} />;
        }
      }

      return hoistNonReactStatics(WithStyles, WrappedComponent);
    };
  }
}
