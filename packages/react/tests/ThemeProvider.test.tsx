/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { TestAesthetic, registerTestTheme, TestTheme } from 'aesthetic/lib/testUtils';
import ThemeProvider from '../src/ThemeProvider';

describe('ThemeProvider', () => {
  let aesthetic: TestAesthetic<TestTheme>;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    aesthetic.options.theme = 'light';

    registerTestTheme(aesthetic);
  });

  it('renders children', () => {
    const wrapper = shallow(
      <ThemeProvider aesthetic={aesthetic}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    expect(wrapper.find('div')).toHaveLength(3);
  });

  it('doesnt re-render children if props never change', () => {
    let count = 0;

    function Child() {
      count += 1;

      return null;
    }

    const wrapper = mount(
      <ThemeProvider aesthetic={aesthetic}>
        <Child />
      </ThemeProvider>,
    );

    wrapper.update();
    wrapper.update();
    wrapper.update();
    wrapper.update();
    wrapper.update();

    expect(count).toBe(1);
  });

  it('changes the theme when the `name` prop changes', () => {
    const wrapper = shallow<ThemeProvider>(
      <ThemeProvider aesthetic={aesthetic}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    wrapper.setProps({
      name: 'dark',
    });

    expect(wrapper.state('themeName')).toBe('dark');
  });

  it('calls `changeTheme` when `propagate` is true', () => {
    const spy = jest.spyOn(aesthetic, 'changeTheme');
    const wrapper = shallow<ThemeProvider>(
      <ThemeProvider aesthetic={aesthetic} propagate>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    wrapper.setProps({
      name: 'dark',
    });

    expect(spy).toHaveBeenCalledWith('dark');
  });

  it('doesnt call `changeTheme` when `propagate` is false', () => {
    const spy = jest.spyOn(aesthetic, 'changeTheme');
    const wrapper = shallow<ThemeProvider>(
      <ThemeProvider aesthetic={aesthetic} propagate>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    wrapper.setProps({
      name: 'dark',
    });

    expect(spy).toHaveBeenCalledWith('dark');
  });
});
