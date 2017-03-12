import injectAtRules from '../../packages/aesthetic-utils/src/injectAtRules';
import { FONT_ROBOTO, KEYFRAME_FADE } from '../mocks';

describe('aesthetic-utils/injectAtRules()', () => {
  it('injects single font face', () => {
    const props = {};

    injectAtRules(props, '@font-face', {
      roboto: FONT_ROBOTO,
    });

    expect(props).toEqual({
      '@font-face': FONT_ROBOTO,
    });
  });

  it('injects multiple font faces', () => {
    const props = {};

    injectAtRules(props, '@font-face', {
      roboto: FONT_ROBOTO,
      mrroboto: FONT_ROBOTO,
    });

    expect(props).toEqual({
      '@font-face': [FONT_ROBOTO, FONT_ROBOTO],
    });
  });

  it('injects animation keyframes', () => {
    const props = {};

    injectAtRules(props, '@keyframes', {
      fade: KEYFRAME_FADE,
    });

    expect(props).toEqual({
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

    expect(props).toEqual({
      '@media (min-width: 300px)': {
        display: 'block',
      },
    });
  });
});
