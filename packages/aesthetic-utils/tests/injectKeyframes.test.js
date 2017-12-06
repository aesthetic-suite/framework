import injectKeyframes from '../src/injectKeyframes';
import { KEYFRAME_FADE } from '../../../tests/mocks';

describe('aesthetic-utils/injectKeyframes()', () => {
  const keyframes = {
    fade: KEYFRAME_FADE,
  };

  it('does nothing if `animationName` doesnt exist', () => {
    const obj = {};

    injectKeyframes(obj, keyframes);

    expect(obj).toEqual({});
  });

  it('replaces animation name with keyframes objects', () => {
    const obj = {
      animationName: 'fade',
    };

    injectKeyframes(obj, keyframes);

    expect(obj).toEqual({
      animationName: [KEYFRAME_FADE],
    });
  });

  it('skips strings and unsupported animations', () => {
    const obj = {
      animationName: 'fade, shake, twist',
    };

    injectKeyframes(obj, keyframes);

    expect(obj).toEqual({
      animationName: [KEYFRAME_FADE, 'shake', 'twist'],
    });
  });

  it('joins keyframes if `join` option is true', () => {
    const obj = {
      animationName: 'fade, shake',
    };

    injectKeyframes(obj, {
      fade: ['fade9329s7'],
    }, { join: true });

    expect(obj).toEqual({
      animationName: 'fade9329s7, shake',
    });
  });
});
