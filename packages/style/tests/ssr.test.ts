import ServerRenderer from '../src/server/ServerRenderer';

describe('SSR', () => {
  let renderer: ServerRenderer;

  beforeEach(() => {
    renderer = new ServerRenderer();

    global.AESTHETIC_CUSTOM_RENDERER = renderer;
  });

  afterEach(() => {
    delete global.AESTHETIC_CUSTOM_RENDERER;
  });

  it('sets SSR global', () => {
    delete global.AESTHETIC_CUSTOM_RENDERER;

    renderer.extractStyles(null);

    expect(global.AESTHETIC_CUSTOM_RENDERER).toBe(renderer);
  });

  it('sets SSR env var', () => {
    delete process.env.AESTHETIC_SSR;

    renderer.extractStyles(null);

    expect(process.env.AESTHETIC_SSR).toBe('true');
  });

  it('writes to a temporary style sheet implementation and generates accurate markup', () => {
    renderer.applyRootVariables({
      fontSize: '16px',
      bgColor: '#fff',
      fbColor: 'black',
    });

    renderer.renderRule({
      margin: 0,
      padding: '6px 12px',
      border: '1px solid #2e6da4',
      borderRadius: '4px',
      display: 'inline-block',
      cursor: 'pointer',
      fontFamily: 'Roboto',
      fontWeight: 'normal',
      lineHeight: 'normal',
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      textAlign: 'left',
      backgroundColor: '#337ab7',
      verticalAlign: 'middle',
      color: 'rgba(0, 0, 0, 0)',
      animationName: 'fade',
      animationDuration: '.3s',
    });

    renderer.renderFontFace({
      fontFamily: '"Open Sans"',
      fontStyle: 'normal',
      fontWeight: 800,
      src: 'url("fonts/OpenSans-Bold.woff2")',
    });

    renderer.renderRule({
      margin: 0,
      '@media (width: 500px)': {
        margin: '10px',
        ':hover': {
          color: 'red',
        },
        '@media (width: 350px)': {
          '@supports (color: blue)': {
            color: 'blue',
          },
        },
      },
      '@supports (color: green)': {
        color: 'green',
      },
    });

    renderer.renderKeyframes({
      from: {
        transform: 'translateX(0%)',
      },
      to: {
        transform: 'translateX(100%)',
      },
    });

    renderer.renderImport('url("test.css")');

    // Test that conditions are merged
    renderer.renderRule({
      margin: 0,
      '@media (width: 500px)': {
        margin: '5px',
      },
      '@supports (color: green)': {
        color: 'black',
      },
    });

    expect(renderer.renderToStyleMarkup()).toMatchSnapshot();
  });

  it('can render media and feature queries', () => {
    renderer.renderRule({
      '@media (max-width: 1000px)': { display: 'block' },
      '@supports (display: flex)': { display: 'flex' },
    });

    expect(renderer.renderToStyleMarkup()).toMatchSnapshot();
  });

  it('can render CSS variables', () => {
    renderer.applyRootVariables({
      '--root-level': 'true',
    });

    renderer.renderRule({
      '--element-level': 123,
    });

    renderer.renderVariable('varLevel', '10px');

    expect(renderer.renderToStyleMarkup()).toMatchSnapshot();
  });

  it('sorts media queries using mobile-first', () => {
    const block = { padding: 0 };

    renderer.renderRule({
      '@media screen and (min-width: 1024px)': block,
      '@media screen and (min-width: 320px) and (max-width: 767px)': block,
      '@media screen and (min-width: 1280px)': block,
      '@media screen and (min-height: 480px)': block,
      '@media screen and (min-height: 480px) and (min-width: 320px)': block,
      '@media screen and (orientation: portrait)': block,
      '@media screen and (min-width: 640px)': block,
      '@media print': block,
      '@media screen and (max-width: 767px) and (min-width: 320px)': block,
      '@media tv': block,
      '@media screen and (max-height: 767px) and (min-height: 320px)': block,
      '@media screen and (orientation: landscape)': block,
      '@media screen and (min-device-width: 320px) and (max-device-width: 767px)': block,
      '@media screen and (max-width: 639px)': block,
      '@media screen and (max-width: 1023px)': block,
    });

    expect(renderer.renderToStyleMarkup()).toMatchSnapshot();
  });
});
