import { expect } from 'chai';
import injectAtRules from '../../src/utils/injectAtRules';
import { FONT_ROBOTO, KEYFRAME_FADE } from '../mocks';

describe('utils/injectAtRules()', () => {
  it('injects single font face', () => {
    const props = {};

    injectAtRules(props, '@font-face', {
      roboto: FONT_ROBOTO,
    });

    expect(props).to.deep.equal({
      '@font-face': FONT_ROBOTO,
    });
  });

  it('injects multiple font faces', () => {
    const props = {};

    injectAtRules(props, '@font-face', {
      roboto: FONT_ROBOTO,
      mrroboto: FONT_ROBOTO,
    });

    expect(props).to.deep.equal({
      '@font-face': [FONT_ROBOTO, FONT_ROBOTO],
    });
  });

  it('injects animation keyframes', () => {
    const props = {};

    injectAtRules(props, '@keyframes', {
      fade: KEYFRAME_FADE,
    });

    expect(props).to.deep.equal({
      '@keyframes fade': KEYFRAME_FADE,
    });
  });

  it('injects media queries', () => {
    const props = {};

    injectAtRules(props, '@media', {
      '(min-width: 300px)': {
        display: 'block',
      },
    });

    expect(props).to.deep.equal({
      '@media (min-width: 300px)': {
        display: 'block',
      },
    });
  });
});
