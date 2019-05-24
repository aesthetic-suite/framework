import React from 'react';
import { shallow } from 'enzyme';
import { TestAesthetic, registerTestTheme } from 'aesthetic/lib/testUtils';
import useThemeFactory from '../src/useThemeFactory';

describe('useThemeFactory()', () => {
  let aesthetic: TestAesthetic;
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

    shallow(<Component />);

    expect(theme).toEqual({ unit: 8 });
  });
});
