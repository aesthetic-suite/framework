import { expect } from 'chai';
import createStyleElement from '../../src/utils/createStyleElement';

describe('utils/createStyleElement()', () => {
  it('creates a style tag and injects into the head', () => {
    const tag = createStyleElement('utils-test');

    expect(tag.nodeName).to.equal('STYLE');
    expect(tag.parentNode).to.equal(document.head);
  });
});
