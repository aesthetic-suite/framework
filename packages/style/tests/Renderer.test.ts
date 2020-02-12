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
