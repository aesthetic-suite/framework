import React, { useContext } from 'react';
import Aesthetic, { StyleSheetFactory } from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import uuid from 'uuid/v4';
import useStylesFactory from './useStylesFactory';
import ThemeContext from './ThemeContext';
import {
  WithStylesOptions,
  WithStylesWrappedProps,
  WithStylesWrapperProps,
  StyledComponent,
} from './types';

/**
 * Wrap a React component with an HOC that injects the defined style sheet as a prop.
 */
export default function withStylesFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const useStyles = useStylesFactory(aesthetic);

  return function withStyles<T>(
    styleSheet: StyleSheetFactory<Theme, T>,
    options: WithStylesOptions = {},
  ) /* infer */ {
    const {
      cxPropName = aesthetic.options.cxPropName,
      extendable = aesthetic.options.extendable,
      extendFrom = '',
      passThemeProp = aesthetic.options.passThemeProp,
      stylesPropName = aesthetic.options.stylesPropName,
      themePropName = aesthetic.options.themePropName,
    } = options;

    type WrappedProps = WithStylesWrappedProps<Theme, NativeBlock, ParsedBlock>;

    return function withStylesComposer<Props extends object = {}>(
      WrappedComponent: React.ComponentType<Props & WrappedProps>,
    ): StyledComponent<Theme, Props & WithStylesWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const styleName = `${baseName}-${uuid()}`;

      // We must register earlier so that extending styles works correctly
      aesthetic.registerStyleSheet(styleName, styleSheet, extendFrom);

      const WithStyles = React.memo(function WithStyles({
        wrappedRef,
        ...props
      }: Props & WithStylesWrapperProps) {
        const themeName = useContext(ThemeContext);
        const [styles, cx] = useStyles(styleSheet, { styleName });
        const extraProps: WrappedProps = {
          [cxPropName as 'cx']: cx,
          [stylesPropName as 'styles']: styles,
          ref: wrappedRef,
        };

        if (passThemeProp) {
          extraProps[themePropName as 'theme'] = aesthetic.getTheme(themeName);
        }

        return <WrappedComponent {...(props as any)} {...extraProps} />;
      }) as StyledComponent<Theme, Props & WithStylesWrapperProps>;

      hoistNonReactStatics(WithStyles, WrappedComponent);

      WithStyles.displayName = `withStyles(${baseName})`;

      WithStyles.styleName = styleName;

      WithStyles.WrappedComponent = WrappedComponent;

      WithStyles.extendStyles = (customStyleSheet, extendOptions) => {
        if (__DEV__) {
          if (!extendable) {
            throw new Error(`${baseName} is not extendable.`);
          }
        }

        return withStyles(customStyleSheet, {
          ...options,
          ...extendOptions,
          extendFrom: styleName,
        })(WrappedComponent);
      };

      return WithStyles;
    };
  };
}
