import { Direction } from '@aesthetic/types';
import { createState, isSSR } from '@aesthetic/utils';
import { emit } from './events';

export const activeDirection = createState<Direction>();

/**
 * Change the active direction.
 */
export function changeDirection(direction: Direction, propagate: boolean = true) {
  if (direction === activeDirection.get()) {
    return;
  }

  // Set the active direction
  activeDirection.set(direction);

  // Update document attribute
  if (!isSSR()) {
    document.documentElement.setAttribute('dir', direction);
  }

  // Let consumers know about the change
  if (propagate) {
    emit('change:direction', [direction]);
  }
}

/**
 * Return the active direction for the entire document. If an active direction is undefined,
 * it will be detected from the browser's `dir` attribute.
 */
export function getActiveDirection(): Direction {
  const active = activeDirection.get();

  if (active) {
    return active;
  }

  let direction: Direction = 'ltr';

  if (!isSSR()) {
    direction = (document.documentElement.getAttribute('dir') ||
      document.body.getAttribute('dir') ||
      'ltr') as Direction;
  }

  changeDirection(direction);

  return direction;
}
