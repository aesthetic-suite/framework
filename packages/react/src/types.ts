// Any must be used here for consumers to be typed correctly.
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { ClassName, Direction, Theme, ThemeName, StringOnly } from '@aesthetic/core';

export type ClassNameGenerator<T> = (
  ...keys: (undefined | null | false | StringOnly<T>)[]
) => ClassName;

// CONTEXT

export type DirectionContextType = Direction;

export interface DirectionProviderProps {
  children: NonNullable<React.ReactNode>;
  /** Explicit direction to use. */
  direction?: Exclude<Direction, 'neutral'>;
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

export interface WrapperComponent {
  WrappedComponent: React.ComponentType<any>;
}

export interface WrapperProps {
  /** Gain a reference to the wrapped component. */
  wrappedRef?: React.Ref<any>;
}

export interface WrappedProps {
  /** The ref passed by the `wrappedRef` prop. */
  ref?: React.Ref<any>;
}

export interface WithDirectionWrappedProps extends WrappedProps {
  /** The current direction. Provided by `withDirection`. */
  direction: Direction;
}

export interface WithThemeWrappedProps extends WrappedProps {
  /** The theme object. Provided by `withTheme`. */
  theme: Theme;
}

export interface WithStylesWrappedProps<T> extends WrappedProps {
  /** Function generate CSS class names from a style sheet. Provided by `withStyles`. */
  cx: ClassNameGenerator<T>;
}
