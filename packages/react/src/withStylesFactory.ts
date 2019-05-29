import React from 'react';
import Aesthetic, { ClassNameTransformer, Direction, StyleSheetDefinition } from 'aesthetic';
import hoistNonReactStatics from 'hoist-non-react-statics';
import uuid from 'uuid/v4';
import { Omit } from 'utility-types';
import DirectionContext from './DirectionContext';
import {
  WithStylesOptions,
  WithStylesState,
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

      type OwnState = WithStylesState<ParsedBlock>;

      aesthetic.setStyleSheet(styleName, styleSheet, extendFrom);

      class WithStyles extends Component<Props & WithStylesWrapperProps, OwnState> {
        static contextType = DirectionContext;

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

        // eslint-disable-next-line @typescript-eslint/member-ordering
        constructor(props: Props & WithStylesWrapperProps, dir: Direction) {
          super(props);

          const opts = {
            name: styleName,
            rtl: aesthetic.isRTL(dir),
          };

          this.state = {
            dir,
            options: opts,
            styles: aesthetic.createStyleSheet(styleName, opts),
          };
        }

        componentDidMount() {
          aesthetic.flushStyles(styleName);
        }

        componentDidUpdate() {
          const dir = this.context;

          if (dir !== this.state.dir) {
            const opts = {
              name: styleName,
              rtl: aesthetic.isRTL(dir),
            };

            // eslint-disable-next-line react/no-did-update-set-state
            this.setState(
              {
                dir,
                options: opts,
                styles: aesthetic.createStyleSheet(styleName, opts),
              },
              () => {
                aesthetic.flushStyles(styleName);
              },
            );
          }
        }

        transformStyles: CX = (...styles) => aesthetic.transformStyles(styles, this.state.options);

        render() {
          const { wrappedRef, ...props } = this.props;
          const extraProps: WithStylesWrappedProps<Theme, NativeBlock, ParsedBlock> = {
            [cxPropName as 'cx']: this.transformStyles,
            [stylesPropName as 'styles']: this.state.styles,
            ref: wrappedRef,
          };

          if (passThemeProp) {
            extraProps[themePropName as 'theme'] = aesthetic.getTheme();
          }

          return React.createElement(WrappedComponent, {
            ...props,
            ...extraProps,
          } as any);
        }
      }

      hoistNonReactStatics(WithStyles, WrappedComponent);

      return WithStyles;
    };
  };
}
