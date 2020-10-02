import { createCacheManager } from '../src';
import { createClientEngine } from '../src/client';
import { CacheStorage, SheetType, StyleEngine } from '../src/types';
import { getRenderedStyles, purgeStyles } from '../src/test';

function createStyle(type: SheetType, lastIndex: number) {
  const style = document.createElement('style');

  style.type = 'text/css';
  style.media = 'screen';
  style.setAttribute('id', `aesthetic-${type}`);
  style.setAttribute('data-aesthetic-hydrate-index', String(lastIndex));
  style.setAttribute('data-aesthetic-rule-index', '21');
  style.setAttribute('data-aesthetic-type', type);

  document.head.append(style);

  return style;
}

describe('Hydration', () => {
  let cache: CacheStorage;
  let engine: StyleEngine;

  beforeEach(() => {
    const globe = createStyle('global', 2);
    globe.textContent = `:root { --font-size:16px;--bg-color:#fff;--fb-color:black; }@import url("test.css");@font-face { font-family:"Open Sans";font-style:normal;font-weight:800;src:url("fonts/OpenSans-Bold.woff2"); }@keyframes kf103rcyx { from { transform:translateX(0%); } to { transform:translateX(100%); }  }`;

    const standard = createStyle('standard', 16);
    standard.textContent = `.a { margin:0; }.b { padding:6px 12px; }.c { border:1px solid #2e6da4; }.d { border-radius:4px; }.e { display:inline-block; }.f { cursor:pointer; }.g { font-family:Roboto; }.h { font-weight:normal; }.i { line-height:normal; }.j { white-space:nowrap; }.k { text-decoration:none; }.l { text-align:left; }.m { background-color:#337ab7; }.n { vertical-align:middle; }.o { color:rgba(0, 0, 0, 0); }.p { animation-name:fade; }.q { animation-duration:.3s; }`;

    const conditions = createStyle('conditions', 3);
    conditions.textContent = `@media (width: 500px) { @media (width: 350px) { @supports (color: blue) { .t { color:blue; } } } }@media (width: 500px) { .s:hover { color:red; } }@media (width: 500px) { .r { margin:10px; } }@supports (color: green) { .u { color:green; } }`;

    cache = {};
    engine = createClientEngine({
      cacheManager: createCacheManager(cache),
    });
  });

  afterEach(() => {
    purgeStyles();
  });

  it('adds at-rules to the global cache', () => {
    expect(cache).toEqual(
      expect.objectContaining({
        '@import:test.css': [{ className: '' }],
        '@font-face:"Open Sans"': [{ className: '' }],
        '@keyframes:kf103rcyx': [{ className: '' }],
      }),
    );
    expect(engine.ruleIndex).toBe(21);
  });

  it('adds standard and condition rules to the class name cache', () => {
    expect(cache).toEqual(
      expect.objectContaining({
        'margin:0': [{ className: 'a', rank: 0 }],
        'padding:6px 12px': [{ className: 'b', rank: 1 }],
        'border:1px solid #2e6da4': [{ className: 'c', rank: 2 }],
        'border-radius:4px': [{ className: 'd', rank: 3 }],
        'display:inline-block': [{ className: 'e', rank: 4 }],
        'cursor:pointer': [{ className: 'f', rank: 5 }],
        'font-family:Roboto': [{ className: 'g', rank: 6 }],
        'font-weight:normal': [{ className: 'h', rank: 7 }],
        'line-height:normal': [{ className: 'i', rank: 8 }],
        'white-space:nowrap': [{ className: 'j', rank: 9 }],
        'text-decoration:none': [{ className: 'k', rank: 10 }],
        'text-align:left': [{ className: 'l', rank: 11 }],
        'background-color:#337ab7': [{ className: 'm', rank: 12 }],
        'vertical-align:middle': [{ className: 'n', rank: 13 }],
        'color:rgba(0, 0, 0, 0)': [{ className: 'o', rank: 14 }],
        'animation-name:fade': [{ className: 'p', rank: 15 }],
        'animation-duration:.3s': [{ className: 'q', rank: 16 }],
        'color:blue:@media (width: 500px):@media (width: 350px):@supports (color: blue)': [
          { className: 't', rank: 0 },
        ],
        'color:red::hover:@media (width: 500px)': [{ className: 's', rank: 1 }],
        'margin:10px:@media (width: 500px)': [{ className: 'r', rank: 2 }],
        'color:green:@supports (color: green)': [{ className: 'u', rank: 3 }],
      }),
    );
    expect(engine.ruleIndex).toBe(21);
  });

  it('doesnt re-insert hydrated font-face', () => {
    engine.renderFontFace({
      fontFamily: '"Open Sans"',
      fontStyle: 'normal',
      fontWeight: 800,
      src: 'url("fonts/OpenSans-Bold.woff2")',
    });

    expect(getRenderedStyles('global')).toMatchSnapshot();
  });

  it('doesnt re-insert hydrated import', () => {
    engine.renderImport('test.css');

    expect(getRenderedStyles('global')).toMatchSnapshot();
  });

  it('doesnt re-insert hydrated keyframes', () => {
    engine.renderKeyframes({
      from: { transform: 'translateX(0%)' },
      to: { transform: 'translateX(100%)' },
    });

    expect(getRenderedStyles('global')).toMatchSnapshot();
  });
});
