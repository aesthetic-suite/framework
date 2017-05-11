import React from 'react';
import { shallow } from 'enzyme';
import ThemeProvider from '../src/ThemeProvider';

describe('aesthetic/ThemeProvider', () => {
  it('renders children', () => {
    const child = <div>{'Child'}</div>;
    const wrapper = shallow(<ThemeProvider name="foo">{child}</ThemeProvider>);

    expect(wrapper.contains(child)).toBe(true);
  });

  it('passes child context', () => {
    const wrapper = shallow(<ThemeProvider name="foo"><div>{'Child'}</div></ThemeProvider>);

    expect(wrapper.instance().getChildContext()).toEqual({
      themeName: 'foo',
    });
  });
});
