import React from 'react';
import getDirection from 'direction';
import { Direction } from '@aesthetic/core';
import DirectionContext from './DirectionContext';
import { DirectionProviderProps } from './types';

/**
 * Explicitly define a direction or automatically infer a direction based on a string of text.
 * Will render an element with a `dir` attribute set.
 */
export default function DirectionProvider({
  children,
  dir,
  inline,
  value,
}: DirectionProviderProps) {
  const Tag = inline ? 'span' : 'div';
  const direction: Direction = dir || getDirection(value) || 'ltr';

  return (
    <DirectionContext.Provider value={direction}>
      <Tag dir={direction}>{children}</Tag>
    </DirectionContext.Provider>
  );
}
