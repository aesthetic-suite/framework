/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { shallow } from 'enzyme';
import { TestAesthetic, registerTestTheme, TestTheme } from 'aesthetic/lib/testUtils';
import DirectionContext from '../src/DirectionContext';
import DirectionProvider from '../src/DirectionProvider';

describe('DirectionProvider', () => {
  let aesthetic: TestAesthetic<TestTheme>;
  const oldProvider = DirectionContext.Provider;

  beforeEach(() => {
    aesthetic = new TestAesthetic();
    aesthetic.options.theme = 'light';

    registerTestTheme(aesthetic);

    DirectionContext.Provider = class MockProvider extends React.Component<any> {
      render() {
        return this.props.children;
      }
    } as any;
  });

  afterEach(() => {
    DirectionContext.Provider = oldProvider;
  });

  it('renders a `div` by default', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic}>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('renders a `span` when `inline`', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic} inline>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('span')).toHaveLength(1);
  });

  it('renders `ltr` explicitly with `dir`', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic} dir="ltr">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('ltr');
  });

  it('renders `rtl` explicitly with `dir`', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic} dir="rtl">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });

  it('renders `dir` over `value`', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic} dir="rtl" value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });

  it('infers `ltr` from `value`', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic} value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('ltr');
  });

  it('infers `rtl` from `value`', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic} value="بسيطة">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });

  it('infers `ltr` from `Aesthetic` instance', () => {
    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic}>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('ltr');
  });

  it('infers `rtl` from `Aesthetic` instance', () => {
    aesthetic.options.rtl = true;

    const wrapper = shallow(
      <DirectionProvider aesthetic={aesthetic}>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });
});
