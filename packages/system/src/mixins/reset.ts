import { Rule } from '@aesthetic/types';

export interface ResetButtonOptions {
  flex?: boolean;
}

export function resetButton({ flex }: ResetButtonOptions): Rule {
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

export function resetInput(): Rule {
  return {
    appearance: 'none',
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
    width: '100%',
    '::-moz-focus-outer': {
      border: 0,
    },
  };
}

export function resetList(): Rule {
  return {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  };
}

export function resetMedia(): Rule {
  return {
    display: 'block',
    verticalAlign: 'middle',
  };
}

export function resetTypography(): Rule {
  return {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'normal',
    wordWrap: 'break-word',
  };
}
