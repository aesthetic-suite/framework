// Any must be used here for consumers to be typed correctly.
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { ClassName, Direction, Theme, ThemeName } from '@aesthetic/core';

export type ClassNameTransformer<T extends string> = (
  ...keys: (undefined | false | T)[]
) => ClassName;

// CONTEXT

export type DirectionContextType = Direction;

export interface DirectionProviderProps {
  children: NonNullable<React.ReactNode>;
  /** Explicit direction to use. */
  dir?: Exclude<Direction, 'neutral'>;
  /** Render an inline element instead of block. */
  inline?: boolean;
  /** Locale aware string to deduce the direction from. */
  value?: string;
}

export type ThemeContextType = Theme;

export interface ThemeProviderProps {
  children: NonNullable<React.ReactNode>;
  /** Theme to activate. */
  name?: ThemeName;
}

// HOCs

export interface WrapperComponent<T> {
  WrappedComponent: React.ComponentType<T>;
}

export interface WithThemeWrapperProps {
  /** Gain a reference to the wrapped component. Provided by `withTheme`. */
  wrappedRef?: React.Ref<any>;
}

export interface WithThemeWrappedProps {
  /** The ref passed by the `wrappedRef` prop. Provided by `withTheme`. */
  ref?: React.Ref<any>;
  /** The theme object. Provided by `withTheme`. */
  theme: Theme;
}
