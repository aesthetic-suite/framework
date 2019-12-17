// Any must be used here for consumers to be typed correctly.
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import {
  ClassNameTransformer,
  CompiledStyleSheet,
  Direction,
  StyleName,
  StyleSheetFactory,
  ThemeName,
  ThemeSheet,
} from 'aesthetic';
import { Omit } from 'utility-types';

export interface DirectionProviderProps {
  children: NonNullable<React.ReactNode>;
  dir?: Exclude<Direction, 'neutral'>;
  inline?: boolean;
  value?: string;
}

export interface ThemeProviderProps {
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
  wrappedRef?: React.Ref<any>;
}

export interface WithThemeWrappedProps<Theme = ThemeSheet> {
  /** The ref passed by the `wrappedRef` prop. Provided by `withTheme`. */
  ref?: React.Ref<any>;
  /** The theme object. Provided by `withTheme`. */
  theme: Theme;
}

export interface WithThemeOptions {
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withTheme`. */
  themePropName?: string;
}

export interface WithStylesWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withStyles`. */
  wrappedRef?: React.Ref<any>;
}

export interface WithStylesWrappedProps<Theme = ThemeSheet> {
  /** Utility function to transform parsed styles into CSS class names. Provided by `withStyles`. */
  cx: ClassNameTransformer;
  /** The ref passed by the `wrappedRef` prop. Provided by `withStyles`. */
  ref?: React.Ref<any>;
  /** The parsed component style sheet in which rulesets can be transformed to class names. Provided by `withStyles`. */
  styles: CompiledStyleSheet;
  /** The theme object when `passThemeProp` is true. Provided by `withStyles`. */
  theme?: Theme;
}

export interface WithStylesOptions {
  /** Name of the prop in which to pass the CSS class name transformer function. Provided by `withStyles`. */
  cxPropName?: string;
  /** Pass the theme object prop to the wrapped component. Provided by `withStyles`. */
  passThemeProp?: boolean;
  /** Name of the prop in which to pass styles to the wrapped component. Provided by `withStyles`. */
  stylesPropName?: string;
  /** Name of the prop in which to pass the theme object to the wrapped component. Provided by `withStyles`. */
  themePropName?: string;
}

// Name is based on react-docgen-typescript:
// https://github.com/styleguidist/react-docgen-typescript/blob/master/src/parser.ts#L850
export interface StyledComponent<Props> extends React.NamedExoticComponent<Props> {
  displayName: string;

  styleName: StyleName;

  WrappedComponent: React.ComponentType<any>;
}
