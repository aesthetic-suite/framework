import React, { useContext } from 'react';
import aesthetic, { StyleSheetFactory, ThemeSheet } from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useStyles from './useStyles';
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
export default function withStyles<T>(
  factory: StyleSheetFactory<ThemeSheet, T>,
  options: WithStylesOptions = {},
) /* infer */ {
  const {
    cxPropName = aesthetic.options.cxPropName,
    passThemeProp = aesthetic.options.passThemeProp,
    stylesPropName = aesthetic.options.stylesPropName,
    themePropName = aesthetic.options.themePropName,
  } = options;

  return function withStylesComposer<Props extends object = {}>(
    WrappedComponent: React.ComponentType<Props & WithStylesWrappedProps>,
  ): StyledComponent<Props & WithStylesWrapperProps> {
    const baseName = WrappedComponent.displayName || WrappedComponent.name;

    // We must register earlier so that extending styles works correctly
    const styleName = aesthetic.registerStyleSheet(factory);

    const WithStyles = React.memo(function WithStyles({
      wrappedRef,
      ...props
    }: Props & WithStylesWrapperProps) {
      const themeName = useContext(ThemeContext);
      const [styles, cx] = useStyles(factory);
      const extraProps: WithStylesWrappedProps = {
        [cxPropName as 'cx']: cx,
        [stylesPropName as 'styles']: styles,
        ref: wrappedRef,
      };

      if (passThemeProp) {
        extraProps[themePropName as 'theme'] = aesthetic.getTheme(themeName);
      }

      return <WrappedComponent {...(props as any)} {...extraProps} />;
    }) as StyledComponent<Props & WithStylesWrapperProps>;

    hoistNonReactStatics(WithStyles, WrappedComponent);

    WithStyles.displayName = `withStyles(${baseName})`;

    WithStyles.styleName = styleName;

    WithStyles.WrappedComponent = WrappedComponent;

    return WithStyles;
  };
}
