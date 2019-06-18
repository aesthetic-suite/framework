/* eslint-disable max-classes-per-file, react/no-multi-comp */

import React from 'react';
import Aesthetic, { ClassNameTransformer, StyleSheetDefinition } from 'aesthetic';
import { isRTL } from 'aesthetic-utils';
import hoistNonReactStatics from 'hoist-non-react-statics';
import uuid from 'uuid/v4';
import { Omit } from 'utility-types';
import DirectionContext from './DirectionContext';
import ThemeContext from './ThemeContext';
import {
  WithStylesOptions,
  WithStylesState,
  WithStylesContextProps,
  WithStylesWrappedProps,
  WithStylesWrapperProps,
  StyledComponentClass,
} from './types';

/**
 * Wrap a React component with an HOC that injects the defined style sheet as a prop.
 */
export default function withStylesFactory<
  Theme extends object,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
>(aesthetic: Aesthetic<Theme, NativeBlock, ParsedBlock>) /* infer */ {
  return function withStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    options: WithStylesOptions = {},
  ) /* infer */ {
    const {
      cxPropName = aesthetic.options.cxPropName,
      extendable = aesthetic.options.extendable,
      extendFrom = '',
      passThemeProp = aesthetic.options.passThemeProp,
      pure = aesthetic.options.pure,
      stylesPropName = aesthetic.options.stylesPropName,
      themePropName = aesthetic.options.themePropName,
    } = options;

    type CX = ClassNameTransformer<NativeBlock, ParsedBlock>;

    return function withStylesComposer<Props extends object = {}>(
      WrappedComponent: React.ComponentType<
        Props & WithStylesWrappedProps<Theme, NativeBlock, ParsedBlock>
      >,
    ): StyledComponentClass<Theme, Props & WithStylesWrapperProps> {
      const baseName = WrappedComponent.displayName || WrappedComponent.name;
      const styleName = `${baseName}-${uuid()}`;
      const Component = pure ? React.PureComponent : React.Component;

      type OwnProps = Props & WithStylesWrapperProps & WithStylesContextProps;
      type OwnState = WithStylesState<ParsedBlock>;

      aesthetic.registerStyleSheet(styleName, styleSheet, extendFrom);

      class WithStyles extends Component<OwnProps, OwnState> {
        constructor(props: OwnProps) {
          super(props);

          this.state = this.createStyleSheet(true);
        }

        componentDidMount() {
          aesthetic.flushStyles(styleName);
        }

        componentDidUpdate(prevProps: OwnProps) {
          const { dir, themeName } = this.props;

          if (dir !== prevProps.dir || themeName !== prevProps.themeName) {
            this.createStyleSheet();
          }
        }

        createStyleSheet = (mount: boolean = false) => {
          const { dir } = this.props;
          const opts = {
            name: styleName,
            rtl: isRTL(dir),
          };
          const state = {
            dir,
            options: opts,
            styles: aesthetic.createStyleSheet(styleName, opts),
          };

          if (mount) {
            return state;
          }

          this.setState(state, () => {
            aesthetic.flushStyles(styleName);
          });

          return state;
        };

        transformStyles: CX = (...styles) => aesthetic.transformStyles(styles, this.state.options);

        render() {
          const { dir, themeName, wrappedRef, ...props } = this.props;
          const extraProps: WithStylesWrappedProps<Theme, NativeBlock, ParsedBlock> = {
            [cxPropName as 'cx']: this.transformStyles,
            [stylesPropName as 'styles']: this.state.styles,
            ref: wrappedRef,
          };

          if (passThemeProp) {
            extraProps[themePropName as 'theme'] = aesthetic.getTheme();
          }

          return <WrappedComponent {...props as any} {...extraProps} />;
        }
      }

      class WithStylesConsumer extends React.Component<Props & WithStylesWrapperProps> {
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

          return withStyles(customStyleSheet, {
            ...options,
            ...extendOptions,
            extendFrom: styleName,
          })(WrappedComponent);
        }

        render() {
          return (
            <ThemeContext.Consumer>
              {theme => (
                <DirectionContext.Consumer>
                  {dir => <WithStyles {...this.props} dir={dir} themeName={theme.themeName} />}
                </DirectionContext.Consumer>
              )}
            </ThemeContext.Consumer>
          );
        }
      }

      hoistNonReactStatics(WithStylesConsumer, WrappedComponent);

      return WithStylesConsumer;
    };
  };
}
