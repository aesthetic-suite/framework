import React from 'react';
import getDirection from 'direction';
import { Direction } from 'aesthetic';
import DirectionContext from './DirectionContext';
import { DirectionProviderProps } from './types';

/**
 * Explicitly define a direction or automatically infer a direction based on a string of text.
 * Will render an element with a `dir` attribute set.
 */
export default function DirectionProvider({
  aesthetic,
  children,
  dir,
  inline,
  value,
}: DirectionProviderProps) {
  const Tag = inline ? 'span' : 'div';
  let direction: Direction | undefined = dir || getDirection(value);

  if (!direction || direction === 'neutral') {
    direction = aesthetic.options.rtl ? 'rtl' : 'ltr';
  }

  return (
    <DirectionContext.Provider value={direction}>
      <Tag dir={direction}>{children}</Tag>
    </DirectionContext.Provider>
  );
}
