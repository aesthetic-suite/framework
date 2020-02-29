import React from 'react';
import { render } from 'rut-dom';
import useDirection from '../src/useDirection';
import DirectionProvider from '../src/DirectionProvider';

describe('useDirection()', () => {
  it('returns "ltr" if no context provided', () => {
    let dir;

    function Component() {
      dir = useDirection();

      return null;
    }

    render<{}>(<Component />);

    expect(dir).toBe('ltr');
  });

  it('returns the direction defined by the provider', () => {
    let dir;

    function Component() {
      dir = useDirection();

      return null;
    }

    render<{}>(
      <DirectionProvider dir="rtl">
        <Component />
      </DirectionProvider>,
    );

    expect(dir).toBe('rtl');
  });
});
