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
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  });

  it('adds at-rules to the global cache', () => {
    const renderer = new ClientRenderer();

    expect(renderer.ruleCache).toEqual({});
    expect(renderer.ruleIndex).toBe(-1);

    renderer.hydrateStyles();

    expect(renderer.ruleCache).toEqual({
      '1p8yvkz': true,
      '1xk69aq': true,
      phgikz: true,
    });
    expect(renderer.ruleIndex).toBe(21);
  });

  it('adds standard and condition rules to the class name cache', () => {
    const renderer = new ClientRenderer();

    expect(renderer.classNameCache.cache).toEqual({});
    expect(renderer.ruleIndex).toBe(-1);

    renderer.hydrateStyles();

    expect(renderer.classNameCache.cache).toEqual({
      margin: {
        '0': [{ className: 'a', conditions: [], rank: 0, selector: '', type: 'standard' }],
        '10px': [
          {
            className: 'r',
            conditions: [{ query: '(width: 500px)', type: 4 }],
            rank: 2,
            selector: '',
            type: 'conditions',
          },
        ],
      },
      padding: {
        '6px 12px': [{ className: 'b', conditions: [], rank: 1, selector: '', type: 'standard' }],
      },
      border: {
        '1px solid #2e6da4': [
          { className: 'c', conditions: [], rank: 2, selector: '', type: 'standard' },
        ],
      },
      'border-radius': {
        '4px': [{ className: 'd', conditions: [], rank: 3, selector: '', type: 'standard' }],
      },
      display: {
        'inline-block': [
          { className: 'e', conditions: [], rank: 4, selector: '', type: 'standard' },
        ],
      },
      cursor: {
        pointer: [{ className: 'f', conditions: [], rank: 5, selector: '', type: 'standard' }],
      },
      'font-family': {
        Roboto: [{ className: 'g', conditions: [], rank: 6, selector: '', type: 'standard' }],
      },
      'font-weight': {
        normal: [{ className: 'h', conditions: [], rank: 7, selector: '', type: 'standard' }],
      },
      'line-height': {
        normal: [{ className: 'i', conditions: [], rank: 8, selector: '', type: 'standard' }],
      },
      'white-space': {
        nowrap: [{ className: 'j', conditions: [], rank: 9, selector: '', type: 'standard' }],
      },
      'text-decoration': {
        none: [{ className: 'k', conditions: [], rank: 10, selector: '', type: 'standard' }],
      },
      'text-align': {
        left: [{ className: 'l', conditions: [], rank: 11, selector: '', type: 'standard' }],
      },
      'background-color': {
        '#337ab7': [{ className: 'm', conditions: [], rank: 12, selector: '', type: 'standard' }],
      },
      'vertical-align': {
        middle: [{ className: 'n', conditions: [], rank: 13, selector: '', type: 'standard' }],
      },
      color: {
        'rgba(0, 0, 0, 0)': [
          { className: 'o', conditions: [], rank: 14, selector: '', type: 'standard' },
        ],
        blue: [
          {
            className: 't',
            conditions: [
              { query: '(color: blue)', type: 12 },
              { query: '(width: 350px)', type: 4 },
              { query: '(width: 500px)', type: 4 },
            ],
            rank: 0,
            selector: '',
            type: 'conditions',
          },
        ],
        green: [
          {
            className: 'u',
            conditions: [{ query: '(color: green)', type: 12 }],
            rank: 3,
            selector: '',
            type: 'conditions',
          },
        ],
        red: [
          {
            className: 's',
            conditions: [{ query: '(width: 500px)', type: 4 }],
            rank: 1,
            selector: ':hover',
            type: 'conditions',
          },
        ],
      },
      'animation-name': {
        fade: [{ className: 'p', conditions: [], rank: 15, selector: '', type: 'standard' }],
      },
      'animation-duration': {
        '.3s': [{ className: 'q', conditions: [], rank: 16, selector: '', type: 'standard' }],
      },
    });
    expect(renderer.ruleIndex).toBe(21);
  });

  it('sets correct indices', () => {
    const renderer = new ClientRenderer();

    expect(renderer.globalStyleSheet.lastIndex).toBe(-1);
    expect(renderer.standardStyleSheet.lastIndex).toBe(-1);
    expect(renderer.conditionsStyleSheet.lastIndex).toBe(-1);

    renderer.hydrateStyles();

    expect(renderer.globalStyleSheet.lastIndex).toBe(2);
    expect(renderer.standardStyleSheet.lastIndex).toBe(16);
    expect(renderer.conditionsStyleSheet.lastIndex).toBe(3);
  });
});
