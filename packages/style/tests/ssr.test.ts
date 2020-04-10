import ServerRenderer from '../src/server/ServerRenderer';

describe('SSR', () => {
  afterEach(() => {
    delete global.AESTHETIC_SSR_CLIENT;
  });

  it('sets SSR global', () => {
    expect(global.AESTHETIC_SSR_CLIENT).toBeUndefined();

    const renderer = new ServerRenderer();
    renderer.captureStyles(null);

    expect(global.AESTHETIC_SSR_CLIENT).toBe(renderer);
  });

  it('writes to a temporary style sheet implementation and generates accurate markup', () => {
    const renderer = new ServerRenderer();

    global.AESTHETIC_SSR_CLIENT = renderer;

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
});
