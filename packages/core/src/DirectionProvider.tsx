import React from 'react';
import getDirection from 'direction';
import DirectionContext from './DirectionContext';
import { Direction } from './types';

export interface DirectionProviderProps {
  children: NonNullable<React.ReactNode>;
  direction?: Exclude<Direction, 'neutral'>;
  inline?: boolean;
  value?: string;
}

/**
 * Explicitly define a direction or automatically infer a direction based on a string of text.
 * Will render an element with a `dir` attribute set.
 */
export default function DirectionProvider({
  children,
  direction,
  inline,
  value,
}: DirectionProviderProps) {
  const dir = direction || getDirection(value);
  const Tag = inline ? 'span' : 'div';

  return (
    <DirectionContext.Provider value={dir}>
      <Tag dir={dir}>{children}</Tag>
    </DirectionContext.Provider>
  );
}
