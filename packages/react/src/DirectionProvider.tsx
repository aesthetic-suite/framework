import React from 'react';
import getDirection from 'direction';
import { Direction } from 'aesthetic';
import DirectionContext from './DirectionContext';

export interface DirectionProviderProps {
  children: NonNullable<React.ReactNode>;
  dir?: Exclude<Direction, 'neutral'>;
  inline?: boolean;
  value?: string;
}

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
  const direction = dir || getDirection(value) || 'neutral';
  const Tag = inline ? 'span' : 'div';

  return (
    <DirectionContext.Provider value={direction}>
      <Tag dir={direction}>{children}</Tag>
    </DirectionContext.Provider>
  );
}
