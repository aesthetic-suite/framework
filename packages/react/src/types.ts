import React from 'react';
import { ClassName, Direction, Theme, ThemeName } from '@aesthetic/core';

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

export type ClassNameTransformer<T extends string> = (
  ...keys: (undefined | false | T)[]
) => ClassName;
