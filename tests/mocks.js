import Adapter from '../packages/aesthetic/src/Adapter';

export const FONT_ROBOTO = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: "url('roboto.woff2') format('roboto')",
};

export const KEYFRAME_FADE = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

export const TEST_CLASS_NAMES = {
  header: '.header',
  footer: '.footer',
};

export class TestAdapter extends Adapter {
  transformStyles(styleName, declarations) {
    if (styleName === 'foo') {
      return declarations;
    }

    return TEST_CLASS_NAMES;
  }
}
