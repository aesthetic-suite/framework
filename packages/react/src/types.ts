import React from 'react';
import { SheetMap, StyleName, StyleSheetDefinition } from 'aesthetic';
import { Omit } from 'utility-types';

export interface WithThemeWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withTheme`. */
  wrappedRef?: React.Ref<any>;
}

export interface WithThemeProps<Theme> {
  /** The ref passed through the `wrappedRef` prop. Provided by `withTheme`. */
  ref?: React.Ref<any>;
  /** The theme object. Provided by `withTheme`. */
  theme: Theme;
}

export interface WithThemeOptions {
  /** Render a pure component instead of a regular component. Provided by `withTheme`. */
  pure?: boolean;
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withTheme`. */
  themePropName?: string;
}

export interface WithStylesWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withStyles`. */
  wrappedRef?: React.Ref<any>;
}

export interface WithStylesProps<Theme, ParsedBlock> {
  /** The ref passed through the `wrappedRef` prop. Provided by `withStyles`. */
  ref?: React.Ref<any>;
  /** The parsed component style sheet in which rulesets can be transformed to class names. Provided by `withStyles`. */
  styles: SheetMap<ParsedBlock>;
  /** The theme object when `passThemeProp` is true. Provided by `withStyles`. */
  theme?: Theme;
}

export interface WithStylesState<Props, ParsedBlock> {
  props?: Props;
  styles: SheetMap<ParsedBlock>;
}

export interface WithStylesOptions {
  /** Can this component's styles be extended to create a new component. Provided by `withStyles`. */
  extendable?: boolean;
  /** The parent component ID in which to extend styles from. This is usually defined automatically. Provided by `withStyles`. */
  extendFrom?: string;
  /** Pass the theme object prop to the wrapped component. Provided by `withStyles`. */
  passThemeProp?: boolean;
  /** Render a pure component instead of a regular component. Provided by `withStyles`. */
  pure?: boolean;
  /** Name of the prop in which to pass styles to the wrapped component. Provided by `withStyles`. */
  stylesPropName?: string;
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withStyles`. */
  themePropName?: string;
}

export interface StyledComponentClass<Theme, Props> extends React.ComponentClass<Props> {
  displayName: string;
  styleName: StyleName;
  WrappedComponent: React.ComponentType<Props & WithStylesProps<Theme, any>>;

  extendStyles<T>(
    styleSheet: StyleSheetDefinition<Theme, T>,
    extendOptions?: Omit<WithStylesOptions, 'extendFrom'>,
  ): StyledComponentClass<Theme, Props>;
}