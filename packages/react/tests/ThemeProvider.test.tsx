/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { TestAesthetic, registerTestTheme } from 'aesthetic/lib/testUtils';
import ThemeProvider from '../src/ThemeProvider';

describe('ThemeProvider', () => {
  let aesthetic: TestAesthetic;
  let changeSpy: jest.SpyInstance;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    aesthetic.options.theme = 'light';

    registerTestTheme(aesthetic);

    changeSpy = jest.spyOn(aesthetic, 'changeTheme');
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

  it('changes the theme on mount if the name provided doesnt match Aesthetic', () => {
    const wrapper = shallow<ThemeProvider>(
      <ThemeProvider aesthetic={aesthetic} name="dark">
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    expect(changeSpy).toHaveBeenCalledWith('dark');
    expect(wrapper.state('themeName')).toBe('dark');
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

    expect(changeSpy).toHaveBeenCalledWith('dark');
    expect(wrapper.state('themeName')).toBe('dark');
  });

  it('changes the theme when the context function is triggered', () => {
    const wrapper = shallow<ThemeProvider>(
      <ThemeProvider aesthetic={aesthetic}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </ThemeProvider>,
    );

    expect(wrapper.state('themeName')).toBe('light');
    expect(wrapper.instance().ctx).toEqual(expect.objectContaining({ themeName: 'light' }));

    wrapper.instance().changeTheme('dark');

    expect(changeSpy).toHaveBeenCalledWith('dark');
    expect(wrapper.state('themeName')).toBe('dark');
    expect(wrapper.instance().ctx).toEqual(expect.objectContaining({ themeName: 'dark' }));
  });
});
