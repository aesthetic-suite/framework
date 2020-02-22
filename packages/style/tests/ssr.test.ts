import ServerRenderer from '../src/server/ServerRenderer';
import renderToStyleMarkup from '../src/server/renderToStyleMarkup';

describe('SSR', () => {
  it('writes to a temporary style sheet implementation and generates accurate markup', () => {
    const renderer = new ServerRenderer();

    renderer.applyRootVariables({
      fontSize: '16px',
      bgColor: '#fff',
      fbColor: 'black',
    });

    renderer.renderRule({
      margin: 0,
      padding: '6px 12px',
      border: '1px solid #2e6da4',
      borderRadius: 4,
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
        margin: 10,
        ':hover': {
          color: 'red',
        },
        '@media (width: 350px)': {
          '@supports (color: blue)': {
            color: 'blue',
          },
        },
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

    expect(renderToStyleMarkup(renderer)).toMatchSnapshot();
  });
});
