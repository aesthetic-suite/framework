import { useContext } from 'react';
import { Direction } from '@aesthetic/types';
import DirectionContext from './DirectionContext';

/**
 * Hook within a component to return the current RTL direction.
 */
export default function useDirection(): Direction {
  return useContext(DirectionContext);
}
