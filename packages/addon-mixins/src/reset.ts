import { LocalBlock } from '@aesthetic/sss';
import { ResetButtonOptions } from './types';

export function resetButton({ flex = false }: ResetButtonOptions = {}): LocalBlock {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    display: flex ? 'inline-flex' : 'inline-block',
    fontSize: 'inherit',
    margin: 0,
    padding: 0,
    textDecoration: 'none',
    userSelect: 'auto',
    verticalAlign: 'middle',
  };
}

export function resetInput(): LocalBlock {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    width: '100%',
    '@selectors': {
      '::-moz-focus-outer': {
        border: 0,
      },
    },
  };
}

export function resetList(): LocalBlock {
  return {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };
}

export function resetMedia(): LocalBlock {
  return {
    display: 'block',
    verticalAlign: 'middle',
  };
}

export function resetTypography(): LocalBlock {
  return {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'normal',
    wordWrap: 'break-word',
  };
}
