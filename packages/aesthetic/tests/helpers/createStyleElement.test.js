import createStyleElement from '../../src/helpers/createStyleElement';

describe('aesthetic/helpers/createStyleElement()', () => {
  it('creates a style tag and injects into the head', () => {
    const tag = createStyleElement('el-test');

    expect(tag.nodeName).toBe('STYLE');
    expect(tag.parentNode).toBe(document.head);
    expect(tag.id).toBe('aesthetic-el-test');
  });
});
