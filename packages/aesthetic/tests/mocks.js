import Adapter from '../src/Adapter';

export const TEST_CLASS_NAMES = {
  header: '.header',
  footer: '.footer',
};

export class TestAdapter extends Adapter {
  transform(styleName, declarations) {
    if (styleName === 'foo') {
      return declarations;
    }

    return TEST_CLASS_NAMES;
  }
}
