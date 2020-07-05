/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { render } from 'rut-dom';
import { aesthetic } from '@aesthetic/core';
import {
  setupAesthetic,
  teardownAesthetic,
  getRenderedStyles,
  darkTheme,
  lightTheme,
} from '@aesthetic/core/src/testing';
import { useStyles } from '../src';
import { createStyleSheet, ButtonProps, Wrapper } from './__mocks__/Button';

describe('useStyles()', () => {
  function Button({ children, block, disabled, large, small }: ButtonProps) {
    const cx = useStyles(createStyleSheet());

    return (
      <button
        type="button"
        className={cx('button', block && 'button_block', disabled && 'button_disabled', {
          // eslint-disable-next-line no-nested-ternary
          size: large ? 'lg' : small ? 'sm' : '',
        })}
      >
        {children}
      </button>
    );
  }

  function CustomSheetButton({ children, sheet }: ButtonProps) {
    const cx = useStyles(sheet!);

    return (
      <button type="button" className={cx()}>
        {children}
      </button>
    );
  }

  function StylelessButton({ children, disabled }: ButtonProps) {
    const cx = useStyles(createStyleSheet());

    return (
      <button type="button" className={cx(disabled && 'button_disabled')}>
        {children}
      </button>
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
      'a b c d e f g h i j k l m n o p q r s t u v w x y z a1 b1 c1 d1 e1',
    );

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('changes class name based on props enabled', () => {
    const { root, update } = render<ButtonProps>(<Button>Child</Button>, {
      wrapper: <Wrapper />,
    });

    expect(root.findOne('button')).toHaveProp(
      'className',
      'a b c d e f g h i j k l m n o p q r s t u v w x y z a1 b1 c1 d1 e1',
    );

    update({ disabled: true });

    expect(root.findOne('button')).toHaveProp(
      'className',
      'a b c d e f g h i j k l m n o p q r s t u v w x y z a1 b1 c1 d1 e1 w1',
    );

    update({ block: true, large: true });

    expect(root.findOne('button')).toHaveProp(
      'className',
      'a b c d e f g h i j k l m n o p q r s t u v w x y z a1 b1 c1 d1 e1 f1 g1 h1 i1 j1 k1 l1 w1 r1 s1 t1 u1 v1',
    );
  });

  it('returns an empty string if no selectors enabled', () => {
    const { root } = render<ButtonProps>(<StylelessButton>Child</StylelessButton>, {
      wrapper: <Wrapper />,
    });

    expect(root.findOne('button')).toHaveProp('className', '');
  });

  it('only renders once unless theme or direction change', () => {
    const sheet = createStyleSheet();
    const spy = jest.spyOn(sheet, 'render');

    const { update } = render<ButtonProps>(
      <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>,
      {
        wrapper: <Wrapper />,
      },
    );

    update();
    update();
    update();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('re-renders if direction changes', () => {
    const sheet = createStyleSheet();
    const spy = jest.spyOn(sheet, 'render');

    const { rerender } = render<ButtonProps>(
      <Wrapper>
        <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>
      </Wrapper>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      darkTheme,
      expect.objectContaining({
        direction: 'ltr',
        theme: 'night',
      }),
    );

    rerender(
      <Wrapper direction="rtl">
        <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>
      </Wrapper>,
    );

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      darkTheme,
      expect.objectContaining({
        direction: 'rtl',
        theme: 'night',
      }),
    );
  });

  it('re-renders if theme changes', () => {
    const sheet = createStyleSheet();
    const spy = jest.spyOn(sheet, 'render');

    const { rerender } = render<ButtonProps>(
      <Wrapper>
        <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>
      </Wrapper>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      darkTheme,
      expect.objectContaining({
        direction: 'ltr',
        theme: 'night',
      }),
    );

    rerender(
      <Wrapper theme="day">
        <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>
      </Wrapper>,
    );

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      lightTheme,
      expect.objectContaining({
        direction: 'ltr',
        theme: 'day',
      }),
    );
  });

  it('re-renders when direction and theme change', () => {
    const sheet = createStyleSheet();
    const spy = jest.spyOn(sheet, 'render');

    const { rerender } = render<ButtonProps>(
      <Wrapper>
        <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>
      </Wrapper>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      darkTheme,
      expect.objectContaining({
        direction: 'ltr',
        theme: 'night',
      }),
    );

    rerender(
      <Wrapper direction="rtl" theme="day">
        <CustomSheetButton sheet={sheet}>Child</CustomSheetButton>
      </Wrapper>,
    );

    // Annoying that this fires multiple times, possible to batch?
    expect(spy).toHaveBeenCalledTimes(4);

    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      darkTheme,
      expect.objectContaining({
        direction: 'rtl',
        theme: 'night',
      }),
    );

    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      lightTheme,
      expect.objectContaining({
        direction: 'rtl',
        theme: 'day',
      }),
    );
  });
});
