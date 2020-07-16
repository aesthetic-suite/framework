/* eslint-disable no-magic-numbers, sort-keys */

import React from 'react';
import { LocalSheet } from '@aesthetic/core';
import { createComponentStyles, DirectionProvider, ThemeProvider } from '../../src';

export function createStyleSheet() {
  return createComponentStyles((css) => ({
    button: css.mixin(['pattern-reset-button', 'border-df'], {
      position: 'relative',
      display: 'inline-flex',
      textAlign: 'center',
      backgroundColor: css.var('palette-brand-color-40'),
      color: css.var('palette-neutral-color-00'),

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

      '@variants': {
        size_sm: {
          minWidth: css.unit(6),
          padding: {
            topBottom: css.var('spacing-sm'),
            leftRight: css.var('spacing-df'),
          },
        },

        size_df: {
          minWidth: css.unit(8),
          padding: {
            topBottom: css.var('spacing-df'),
            leftRight: css.var('spacing-md'),
          },
        },

        size_lg: {
          minWidth: css.unit(10),
          padding: {
            topBottom: css.var('spacing-md'),
            leftRight: css.var('spacing-lg'),
          },
        },
      },
    }),

    button_block: css.mixin('pattern-text-wrap', {
      display: 'block',
      width: '100%',
      whiteSpace: 'normal',
      overflow: 'hidden',
    }),

    button_disabled: {
      '@variants': {
        size_sm: {
          opacity: 0.4,
        },

        size_df: {
          opacity: 0.5,
        },

        size_lg: {
          opacity: 0.6,
        },
      },
    },
  }));
}

export interface ButtonProps {
  children: NonNullable<React.ReactNode>;
  block?: boolean;
  disabled?: boolean;
  href?: string;
  large?: boolean;
  small?: boolean;
  sheet?: LocalSheet;
}

export interface WrapperProps {
  children?: React.ReactNode;
  direction?: 'ltr' | 'rtl';
  theme?: string;
}

export function Wrapper({ children, direction = 'ltr', theme = 'night' }: WrapperProps) {
  return (
    <DirectionProvider direction={direction}>
      <ThemeProvider name={theme}>{children || <div />}</ThemeProvider>
    </DirectionProvider>
  );
}
