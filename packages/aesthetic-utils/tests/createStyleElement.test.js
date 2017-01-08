import { expect } from 'chai';
import createStyleElement from '../src/createStyleElement';

describe('createStyleElement()', () => {
  it('creates a style tag and injects into the head', () => {
    const tag = createStyleElement('utils-test');

    expect(tag.nodeName).to.equal('STYLE');
    expect(tag.parentNode).to.equal(document.head);
  });
});
