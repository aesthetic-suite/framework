import createStyleElement from '../../src/helpers/createStyleElement';

describe('aesthetic-utils/createStyleElement()', () => {
  it('creates a style tag and injects into the head', () => {
    const tag = createStyleElement('utils-test');

    expect(tag.nodeName).toBe('STYLE');
    expect(tag.parentNode).toBe(document.head);
  });
});
