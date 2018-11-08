/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import uuid from 'uuid/v4';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Aesthetic from './Aesthetic';
import ThemeContext from './ThemeContext';
import { ThemeName, StyleName, StyleSheetDefinition, StyleSheetMap, Omit } from './types';

export interface WithStylesWrapperProps {
  themeName?: ThemeName;
  wrappedRef?: React.Ref<any>;
}

export interface WithStylesProps<Theme, ParsedBlock> {
  ref?: React.Ref<any>;
  styles: StyleSheetMap<ParsedBlock>;
  theme?: Theme;
  themeName?: ThemeName;
}

export interface WithStylesState<ParsedBlock> {
  styles: StyleSheetMap<ParsedBlock>;
  themeName: ThemeName;
}

export interface WithStylesOptions {
  extendable: boolean;
  extendFrom: string;
  passThemeNameProp: boolean;
  passThemeProp: boolean;
  pure: boolean;
  stylesPropName: string;
  themePropName: string;
}

export interface StyledComponent<Theme, Props> extends React.ComponentClass<Props> {
  displayName: string;
  styleName: StyleName;
  WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, any>>;

  extendStyles(
    styleSheet: StyleSheetDefinition<Theme, Props>,
    extendOptions?: Partial<Omit<WithStylesOptions, 'extendFrom'>>,
  ): StyledComponent<Theme, Props>;
}

export default function withStyles<Theme, NativeBlock, ParsedBlock = NativeBlock>(
  aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>,
  styleSheet: StyleSheetDefinition<Theme>,
  options: Partial<WithStylesOptions> = {},
) {
  return function<Props>(
    WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, ParsedBlock>>,
  ): StyledComponent<Theme, Props & WithStylesWrapperProps> {
    const {
      extendable = aesthetic.options.extendable,
      extendFrom = '',
      passThemeNameProp = aesthetic.options.passThemeNameProp,
      passThemeProp = aesthetic.options.passThemeProp,
      pure = aesthetic.options.pure,
      stylesPropName = aesthetic.options.stylesPropName,
      themePropName = aesthetic.options.themePropName,
    } = options;
    const baseName = WrappedComponent.displayName || WrappedComponent.name;
    const styleName = `${baseName}-${uuid()}`;
    const Component = pure ? React.PureComponent : React.Component;

    // Set base styles
    aesthetic.setStyles(styleName, styleSheet, extendFrom);

    class WithStyles extends Component<
      Props & WithStylesWrapperProps,
      WithStylesState<ParsedBlock>
    > {
      // @ts-ignore
      static contextType = ThemeContext;

      static displayName = `withAestheticStyles(${baseName})`;

      static styleName = styleName;

      static WrappedComponent = WrappedComponent;

      static extendStyles(
        customStyleSheet: StyleSheetDefinition<Theme, Props>,
        extendOptions: Partial<WithStylesOptions> = {},
      ) {
        if (process.env.NODE_ENV !== 'production') {
          if (!extendable) {
            throw new Error(`${baseName} is not extendable.`);
          }
        }

        return withStyles(aesthetic, customStyleSheet, {
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

        return <Component {...props} {...extraProps} />;
      }
    }

    return hoistNonReactStatics(WithStyles, Component);
  };
}
