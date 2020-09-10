import { Rule } from '@aesthetic/types';

export function hideCompletely(): Rule {
  return {
    display: 'none',
  };
}

export function hideOffscreen(): Rule {
  return {
    clipPath: 'rect(1px, 1px, 1px, 1px)',
    height: 1,
    left: '-5vw',
    overflow: 'hidden',
    position: 'fixed',
    width: 1,
  };
}

export function hideVisually(): Rule {
  return {
    [':not(:focus):not(:active)' as ':focus']: {
      border: 0,
      clip: 'rect(0, 0, 0, 0)',
      clipPath: 'inset(50%)',
      height: 1,
      margin: 0,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    } as const,
  };
}
