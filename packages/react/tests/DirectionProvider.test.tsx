/* eslint-disable react/jsx-no-literals */

import React from 'react';
import { shallow } from 'enzyme';
import DirectionContext from '../src/DirectionContext';
import DirectionProvider from '../src/DirectionProvider';

describe('DirectionProvider', () => {
  const oldProvider = DirectionContext.Provider;

  beforeEach(() => {
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
      <DirectionProvider>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('renders a `span` when `inline`', () => {
    const wrapper = shallow(
      <DirectionProvider inline>
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('span')).toHaveLength(1);
  });

  it('renders `ltr` explicitly with `dir`', () => {
    const wrapper = shallow(
      <DirectionProvider dir="ltr">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('ltr');
  });

  it('renders `rtl` explicitly with `dir`', () => {
    const wrapper = shallow(
      <DirectionProvider dir="rtl">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });

  it('renders `dir` over `value`', () => {
    const wrapper = shallow(
      <DirectionProvider dir="rtl" value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });

  it('infers `ltr` from `value`', () => {
    const wrapper = shallow(
      <DirectionProvider value="Hello!">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('ltr');
  });

  it('infers `rtl` from `value`', () => {
    const wrapper = shallow(
      <DirectionProvider value="بسيطة">
        <section>Content</section>
      </DirectionProvider>,
    );

    expect(wrapper.find('div').prop('dir')).toBe('rtl');
  });
});
