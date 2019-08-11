import React from 'react';
import Aesthetic, {
  ClassNameTransformer,
  Direction,
  SheetMap,
  StyleName,
  StyleSheetDefinition,
  ThemeName,
} from 'aesthetic';
import { Omit } from 'utility-types';

export interface DirectionProviderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aesthetic: Aesthetic<any, any, any>;
  children: NonNullable<React.ReactNode>;
  dir?: Exclude<Direction, 'neutral'>;
  inline?: boolean;
  value?: string;
}

export interface ThemeProviderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aesthetic: Aesthetic<any, any, any>;
  children: NonNullable<React.ReactNode>;
  name?: ThemeName;
  propagate?: boolean;
}

export interface ThemeProviderState {
  themeName: ThemeName;
}

export interface UseStylesOptions {
  /** Custom name for the component being styled. */
  styleName?: string;
}

export interface WithThemeWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withTheme`. */
  wrappedRef?: React.Ref<unknown>;
}

export interface WithThemeWrappedProps<Theme> {
  /** The ref passed by the `wrappedRef` prop. Provided by `withTheme`. */
  ref?: React.Ref<unknown>;
  /** The theme object. Provided by `withTheme`. */
  theme: Theme;
}

export interface WithThemeOptions {
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withTheme`. */
  themePropName?: string;
}

export interface WithStylesWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withStyles`. */
  wrappedRef?: React.Ref<unknown>;
}

export interface WithStylesWrappedProps<
  Theme,
  NativeBlock extends object,
  ParsedBlock extends object | string = NativeBlock
> {
  /** Utility function to transform parsed styles into CSS class names. Provided by `withStyles`. */
  cx: ClassNameTransformer<NativeBlock, ParsedBlock>;
  /** The ref passed by the `wrappedRef` prop. Provided by `withStyles`. */
  ref?: React.Ref<unknown>;
  /** The parsed component style sheet in which rulesets can be transformed to class names. Provided by `withStyles`. */
  styles: SheetMap<ParsedBlock>;
  /** The theme object when `passThemeProp` is true. Provided by `withStyles`. */
  theme?: Theme;
}

export interface WithStylesOptions {
  /** Name of the prop in which to pass the CSS class name transformer function. Provided by `withStyles`. */
  cxPropName?: string;
  /** Can this component's styles be extended to create a new component. Provided by `withStyles`. */
  extendable?: boolean;
  /** The parent component ID in which to extend styles from. This is usually defined automatically. Provided by `withStyles`. */
  extendFrom?: string;
  /** Pass the theme object prop to the wrapped component. Provided by `withStyles`. */
  passThemeProp?: boolean;
  /** Name of the prop in which to pass styles to the wrapped component. Provided by `withStyles`. */
  stylesPropName?: string;
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withStyles`. */
  themePropName?: string;
}

// Name is based on react-docgen-typescript:
// https://github.com/styleguidist/react-docgen-typescript/blob/master/src/parser.ts#L850
export interface StyledComponent<Theme, Props> extends React.NamedExoticComponent<Props> {
  displayName: string;
  styleName: StyleName;
  WrappedComponent: React.ComponentType<{}>;

  extendStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    extendOptions?: Omit<WithStylesOptions, 'extendFrom'>,
  ): StyledComponent<Theme, Props>;
}
