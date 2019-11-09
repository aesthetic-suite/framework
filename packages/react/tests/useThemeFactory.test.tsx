import React from 'react';
import { render } from 'rut-dom';
import { TestAesthetic, registerTestTheme, TestTheme } from 'aesthetic/lib/testUtils';
import useThemeFactory from '../src/useThemeFactory';

describe('useThemeFactory()', () => {
  let aesthetic: TestAesthetic<TestTheme>;
  let useTheme: ReturnType<typeof useThemeFactory>;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    useTheme = useThemeFactory(aesthetic);

    registerTestTheme(aesthetic);
  });

  it('returns the theme object', () => {
    let theme;

    function Component() {
      theme = useTheme();

      return null;
    }

    render<{}>(<Component />);

    expect(theme).toEqual({ color: 'black', unit: 8 });
  });
});
