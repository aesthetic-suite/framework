import Renderer from '../src/client/ClientRenderer';
import getInsertedStyles from '../src/helpers/getInsertedStyles';
import purgeStyles from './purgeStyles';

describe('At-rules', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  afterEach(() => {
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  });

  it('doesnt insert the same at-rule more than once', () => {
    renderer.renderFontFace({
      fontFamily: '"Open Sans"',
      fontStyle: 'normal',
      fontWeight: 800,
      src: 'url("fonts/OpenSans-Bold.woff2")',
    });
    renderer.renderFontFace({
      fontFamily: '"Open Sans"',
      fontStyle: 'normal',
      fontWeight: 800,
      src: 'url("fonts/OpenSans-Bold.woff2")',
    });
    renderer.renderKeyframes({
      from: {
        transform: 'translateX(0%)',
      },
      to: {
        transform: 'translateX(100%)',
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

    expect(getInsertedStyles('global')).toMatchSnapshot();
  });

  it('inserts at-rules before standard rules', () => {
    renderer.renderRule({ display: 'block' }, { type: 'global' });

    renderer.renderFontFace({
      fontFamily: '"Open Sans"',
      fontStyle: 'normal',
      fontWeight: 800,
      src: 'url("fonts/OpenSans-Bold.woff2")',
    });

    expect(getInsertedStyles('global')).toMatchSnapshot();
  });

  describe('@font-face', () => {
    it('renders and returns family name', () => {
      const name = renderer.renderFontFace({
        fontFamily: '"Open Sans"',
        fontStyle: 'normal',
        fontWeight: 800,
        src: 'url("fonts/OpenSans-Bold.woff2")',
      });

      expect(name).toBe('"Open Sans"');
      expect(getInsertedStyles('global')).toMatchSnapshot();
    });

    it('errors if no family name provided', () => {
      expect(() => {
        renderer.renderFontFace({
          fontFamily: '',
          fontStyle: 'normal',
        });
      }).toThrow('Font faces require a font family.');
    });
  });

  describe('@import', () => {
    it('renders all variants', () => {
      renderer.renderImport('url("print.css") print');
      renderer.renderImport('url("a11y.css") speech');
      renderer.renderImport("'custom.css'");
      renderer.renderImport('url("chrome://communicator/skin")');
      renderer.renderImport('"common.css" screen;'); // Ends in semicolon
      renderer.renderImport("url('landscape.css') screen and (orientation: landscape)");

      expect(getInsertedStyles('global')).toMatchSnapshot();
    });
  });

  describe('@keyframes', () => {
    it('renders range based and returns animation name', () => {
      const name = renderer.renderKeyframes({
        from: {
          transform: 'translateX(0%)',
        },
        to: {
          transform: 'translateX(100%)',
        },
      });

      expect(name).toBe('kf103rcyx');
      expect(getInsertedStyles('global')).toMatchSnapshot();
    });

    it('renders percentage based and returns animation name', () => {
      const name = renderer.renderKeyframes({
        '0%': { top: 0, left: 0 },
        '30%': { top: 50 },
        '68%, 72%': { left: '50px' },
        '100%': { top: 100, left: '100%' },
      });

      expect(name).toBe('kf22exw8');
      expect(getInsertedStyles('global')).toMatchSnapshot();
    });

    it('can provide a custom animation name', () => {
      const name = renderer.renderKeyframes(
        {
          from: {
            transform: 'translateX(0%)',
          },
          to: {
            transform: 'translateX(100%)',
          },
        },
        'slide',
      );

      expect(name).toBe('slide');
      expect(getInsertedStyles('global')).toMatchSnapshot();
    });
  });
});
