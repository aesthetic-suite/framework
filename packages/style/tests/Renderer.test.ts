import Renderer from '../src/Renderer';

describe('Renderer', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();

    // Stub so that we can flush immediately
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(Date.now());

      return 1;
    });
  });

  it('generates a unique class name for each property', () => {
    const className = renderer.render({
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

    expect(className).toBe(
      '13kbekr fj61tt 1pue5r2 odvm0w 169hbqq 16r1ggk 1c05vza 16weknc wyq6ru 1a0rdy6 1dh7ri5 1sl4fpf 9tlqaj g4y2l6 1o2fiv7 1ql63jz rwfe5q',
    );
    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('uses the same class name for the same property value pair', () => {
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'inline');
    renderer.renderDeclaration('display', 'block');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('uses the same class name for numeric and string values', () => {
    renderer.renderDeclaration('width', 100);
    renderer.renderDeclaration('width', '100px');
    renderer.renderDeclaration('width', '100em');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('applies a px unit to numeric properties that require it', () => {
    renderer.renderDeclaration('width', 300);
    renderer.renderDeclaration('marginTop', 10);

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('doesnt apply a px unit to numeric properties that dont require it', () => {
    renderer.renderDeclaration('lineHeight', 1.5);
    renderer.renderDeclaration('fontWeight', 600);

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  it('doesnt apply a px unit to properties that are already prefixed', () => {
    renderer.renderDeclaration('paddingLeft', '10px');
    renderer.renderDeclaration('height', '10vh');

    expect(renderer.flushedStyles).toMatchSnapshot();
  });

  describe('at-rules', () => {
    // describe('@charset', () => {
    //   it('renders without quotes', () => {
    //     renderer.renderAtRule('@charset', '"utf8"');

    //     console.log('ASSERT');

    //     expect(renderer.flushedStyles).toBe('');
    //   });
    // });

    describe('@font-face', () => {
      it('renders', () => {
        renderer.renderFontFace({
          fontFamily: 'Open Sans',
          fontStyle: 'normal',
          fontWeight: 800,
          src: 'url("fonts/OpenSans-Bold.woff2")',
        });

        expect(renderer.flushedStyles).toMatchSnapshot();
      });
    });
  });
});
