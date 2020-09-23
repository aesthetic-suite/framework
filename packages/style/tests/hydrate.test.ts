import ClientRenderer from '../src/client/ClientRenderer';
import { SheetType } from '../src/types';
import { purgeStyles } from '../src/testing';

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
  beforeEach(() => {
    const globe = createStyle('global', 2);
    globe.textContent = `:root { --font-size:16px;--bg-color:#fff;--fb-color:black; }@import url("test.css");@font-face { font-family:"Open Sans";font-style:normal;font-weight:800;src:url("fonts/OpenSans-Bold.woff2"); }@keyframes kf103rcyx { from { transform:translateX(0%); } to { transform:translateX(100%); }  }`;

    const standard = createStyle('standard', 16);
    standard.textContent = `.a { margin:0; }.b { padding:6px 12px; }.c { border:1px solid #2e6da4; }.d { border-radius:4px; }.e { display:inline-block; }.f { cursor:pointer; }.g { font-family:Roboto; }.h { font-weight:normal; }.i { line-height:normal; }.j { white-space:nowrap; }.k { text-decoration:none; }.l { text-align:left; }.m { background-color:#337ab7; }.n { vertical-align:middle; }.o { color:rgba(0, 0, 0, 0); }.p { animation-name:fade; }.q { animation-duration:.3s; }`;

    const conditions = createStyle('conditions', 3);
    conditions.textContent = `@media (width: 500px) { @media (width: 350px) { @supports (color: blue) { .t { color:blue; } } } }@media (width: 500px) { .s:hover { color:red; } }@media (width: 500px) { .r { margin:10px; } }@supports (color: green) { .u { color:green; } }`;
  });

  afterEach(() => {
    purgeStyles();
  });

  it('adds at-rules to the global cache', () => {
    const renderer = new ClientRenderer();

    expect(renderer.cache.cache).toEqual({});
    expect(renderer.ruleIndex).toBe(-1);

    renderer.hydrateStyles();

    expect(renderer.cache.cache).toEqual(
      expect.objectContaining({
        '1xk69aq': [{ className: '1xk69aq' }],
        '1p8yvkz': [{ className: '1p8yvkz' }],
        phgikz: [{ className: 'phgikz' }],
      }),
    );
    expect(renderer.ruleIndex).toBe(21);
  });

  it('adds standard and condition rules to the class name cache', () => {
    const renderer = new ClientRenderer();

    expect(renderer.cache.cache).toEqual({});
    expect(renderer.ruleIndex).toBe(-1);

    renderer.hydrateStyles();

    expect(renderer.cache.cache).toEqual(
      expect.objectContaining({
        'margin:0;': [{ className: 'a', rank: 0 }],
        'padding:6px 12px;': [{ className: 'b', rank: 1 }],
        'border:1px solid #2e6da4;': [{ className: 'c', rank: 2 }],
        'border-radius:4px;': [{ className: 'd', rank: 3 }],
        'display:inline-block;': [{ className: 'e', rank: 4 }],
        'cursor:pointer;': [{ className: 'f', rank: 5 }],
        'font-family:Roboto;': [{ className: 'g', rank: 6 }],
        'font-weight:normal;': [{ className: 'h', rank: 7 }],
        'line-height:normal;': [{ className: 'i', rank: 8 }],
        'white-space:nowrap;': [{ className: 'j', rank: 9 }],
        'text-decoration:none;': [{ className: 'k', rank: 10 }],
        'text-align:left;': [{ className: 'l', rank: 11 }],
        'background-color:#337ab7;': [{ className: 'm', rank: 12 }],
        'vertical-align:middle;': [{ className: 'n', rank: 13 }],
        'color:rgba(0, 0, 0, 0);': [{ className: 'o', rank: 14 }],
        'animation-name:fade;': [{ className: 'p', rank: 15 }],
        'animation-duration:.3s;': [{ className: 'q', rank: 16 }],
        'color:blue;@supports (color: blue)@media (width: 350px)@media (width: 500px)': [
          { className: 't', rank: 0 },
        ],
        'color:red;:hover@media (width: 500px)': [{ className: 's', rank: 1 }],
        'margin:10px;@media (width: 500px)': [{ className: 'r', rank: 2 }],
        'color:green;@supports (color: green)': [{ className: 'u', rank: 3 }],
      }),
    );
    expect(renderer.ruleIndex).toBe(21);
  });

  it('sets correct indices', () => {
    const renderer = new ClientRenderer();

    expect(renderer.sheetManager.getSheet('global').lastIndex).toBeUndefined();
    expect(renderer.sheetManager.getSheet('standard').lastIndex).toBeUndefined();
    expect(renderer.sheetManager.getSheet('conditions').lastIndex).toBeUndefined();

    renderer.hydrateStyles();

    expect(renderer.sheetManager.getSheet('global').lastIndex).toBe(2);
    expect(renderer.sheetManager.getSheet('standard').lastIndex).toBe(16);
    expect(renderer.sheetManager.getSheet('conditions').lastIndex).toBe(3);
  });
});
