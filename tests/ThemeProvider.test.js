import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ThemeProvider from '../src/ThemeProvider';

describe('ThemeProvider', () => {
  it('renders children', () => {
    const child = <div>Child</div>;
    const wrapper = shallow(<ThemeProvider name="foo">{child}</ThemeProvider>);

    expect(wrapper.contains(child)).to.equal(true);
  });

  it('passes child context', () => {
    const wrapper = shallow(<ThemeProvider name="foo"><div>Child</div></ThemeProvider>);

    expect(wrapper.instance().getChildContext()).to.deep.equal({
      themeName: 'foo',
    });
  });
});
