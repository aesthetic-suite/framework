import StyleSheetManager from '../src/StyleSheetManager';

describe('StyleSheetManager', () => {
  let manager: StyleSheetManager;

  beforeEach(() => {
    manager = new StyleSheetManager();
  });

  it('creates a style element in the head', () => {
    const el = document.head.children[0] as HTMLStyleElement;

    expect(el).toBeInstanceOf(HTMLStyleElement);
    expect(el.type).toBe('text/css');
    expect(el.media).toBe('screen');
    expect(el.getAttribute('data-aesthetic')).toBe('true');
  });

  it('can inject single rules', () => {
    manager.injectRule('.class { display: none; }');
    manager.injectRule('#id { background: none; }');

    expect(manager.getInjectedStyles()).toBe('.class {display: none;}#id {background: none;}');
  });

  it('can inject multiple rules', () => {
    manager.injectStatements('.class { display: none; } #id { background: none; }');

    expect(manager.getInjectedStyles()).toBe('.class { display: none; } #id { background: none; }');
  });
});
