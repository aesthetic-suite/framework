/* eslint-disable @typescript-eslint/camelcase, react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { aesthetic } from '@aesthetic/core';
import { setupAesthetic, teardownAesthetic, getRenderedStyles } from '@aesthetic/core/src/testing';
import { createComponentStyles, useStyles, DirectionProvider, ThemeProvider } from '../src';

describe('useStyles()', () => {
  function createStyleSheet() {
    return createComponentStyles(css => ({
      button: css.mixin(['pattern-reset-button', 'border-df'], {
        position: 'relative',
        display: 'inline-flex',
        textAlign: 'center',
        backgroundColor: css.var('palette-brand-color-40'),
        color: css.var('palette-neutral-color-00'),
        minWidth: css.unit(8),
        padding: {
          topBottom: css.var('spacing-df'),
          leftRight: css.var('spacing-md'),
        },

        ':hover': {
          backgroundColor: css.var('palette-brand-color-50'),
        },

        ':active': {
          backgroundColor: css.var('palette-brand-color-60'),
        },

        '@selectors': {
          '::-moz-focus-inner': {
            border: 0,
            padding: 0,
            margin: 0,
          },
        },
      }),

      button_block: css.mixin('pattern-text-wrap', {
        display: 'block',
        width: '100%',
        whiteSpace: 'normal',
        overflow: 'hidden',
      }),

      button_small: {
        minWidth: css.unit(6),
        padding: {
          topBottom: css.var('spacing-sm'),
          leftRight: css.var('spacing-df'),
        },
      },

      button_large: {
        minWidth: css.unit(10),
        padding: {
          topBottom: css.var('spacing-md'),
          leftRight: css.var('spacing-lg'),
        },
      },

      button_disabled: {
        opacity: 0.5,
      },
    }));
  }

  interface ButtonProps {
    children: NonNullable<React.ReactNode>;
    block?: boolean;
    disabled?: boolean;
    large?: boolean;
    small?: boolean;
  }

  function Button({ children, block, disabled, large, small }: ButtonProps) {
    const cx = useStyles(createStyleSheet());

    return (
      <button
        type="button"
        className={cx(
          'button',
          block && 'button_block',
          disabled && 'button_disabled',
          large && 'button_large',
          small && 'button_small',
        )}
      >
        {children}
      </button>
    );
  }

  interface WrapperProps {
    children?: React.ReactNode;
    direction?: 'ltr' | 'rtl';
    theme?: string;
  }

  function Wrapper({ children, direction = 'ltr', theme = 'night' }: WrapperProps) {
    return (
      <DirectionProvider direction={direction}>
        <ThemeProvider name={theme}>{children || <div />}</ThemeProvider>
      </DirectionProvider>
    );
  }

  beforeEach(() => {
    setupAesthetic(aesthetic);
  });

  afterEach(() => {
    teardownAesthetic(aesthetic);
  });

  it('renders a button and its base styles', () => {
    const { root } = render<ButtonProps>(<Button>Child</Button>, {
      wrapper: <Wrapper />,
    });

    expect(root.findOne('button')).toHaveProp(
      'className',
      'a b c d e f g h i j k l m n o p q r s t u v w x y z a1 b1',
    );

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });
});
