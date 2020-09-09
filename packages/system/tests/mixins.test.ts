import mixins from '../src/mixins';
import { darkTheme } from '../src/testing';

describe('Mixins', () => {
  it('border', () => {
    expect(mixins.border(darkTheme.var, 'sm')).toMatchSnapshot();
    expect(mixins.border(darkTheme.var, 'df')).toMatchSnapshot();
    expect(mixins.border(darkTheme.var, 'lg')).toMatchSnapshot();
  });

  it('box', () => {
    expect(mixins.box(darkTheme.var, 'sm')).toMatchSnapshot();
    expect(mixins.box(darkTheme.var, 'df')).toMatchSnapshot();
    expect(mixins.box(darkTheme.var, 'lg')).toMatchSnapshot();
  });

  it('heading', () => {
    expect(mixins.heading(darkTheme.var, 'l1')).toMatchSnapshot();
    expect(mixins.heading(darkTheme.var, 'l2')).toMatchSnapshot();
    expect(mixins.heading(darkTheme.var, 'l3')).toMatchSnapshot();
    expect(mixins.heading(darkTheme.var, 'l4')).toMatchSnapshot();
    expect(mixins.heading(darkTheme.var, 'l5')).toMatchSnapshot();
    expect(mixins.heading(darkTheme.var, 'l6')).toMatchSnapshot();
  });

  it('pattern', () => {
    expect(mixins.hideCompletely()).toMatchSnapshot();
    expect(mixins.hideOffscreen()).toMatchSnapshot();
    expect(mixins.hideVisually()).toMatchSnapshot();
    expect(mixins.resetButton()).toMatchSnapshot();
    expect(mixins.resetInput()).toMatchSnapshot();
    expect(mixins.resetList()).toMatchSnapshot();
    expect(mixins.resetMedia()).toMatchSnapshot();
    expect(mixins.resetTypography()).toMatchSnapshot();
    expect(mixins.root(darkTheme.var, darkTheme.toTokens().breakpoint)).toMatchSnapshot();
    expect(mixins.textBreak()).toMatchSnapshot();
    expect(mixins.textTruncate()).toMatchSnapshot();
    expect(mixins.textWrap()).toMatchSnapshot();
  });

  it('shadow', () => {
    expect(mixins.shadow(darkTheme.var, 'xs')).toMatchSnapshot();
    expect(mixins.shadow(darkTheme.var, 'sm')).toMatchSnapshot();
    expect(mixins.shadow(darkTheme.var, 'md')).toMatchSnapshot();
    expect(mixins.shadow(darkTheme.var, 'lg')).toMatchSnapshot();
    expect(mixins.shadow(darkTheme.var, 'xl')).toMatchSnapshot();
  });

  it('text', () => {
    expect(mixins.text(darkTheme.var, 'sm')).toMatchSnapshot();
    expect(mixins.text(darkTheme.var, 'df')).toMatchSnapshot();
    expect(mixins.text(darkTheme.var, 'lg')).toMatchSnapshot();
  });
});
