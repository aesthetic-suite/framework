import ClientRenderer from '../src/client/ClientRenderer';
import ServerRenderer from '../src/server/ServerRenderer';
import { getRenderedStyles, purgeStyles } from '../src/testing';

describe('Conditions', () => {
  let renderer: ClientRenderer;

  beforeEach(() => {
    renderer = new ClientRenderer();
  });

  afterEach(() => {
    purgeStyles();
  });

  describe('media queries', () => {
    it('supports @media conditions', () => {
      const className = renderer.renderRule({
        background: '#000',
        padding: '15px',
        '@media (max-width: 600px)': {
          padding: '15px',
        },
        '@media screen and (min-width: 900px)': {
          padding: '20px',
        },
      });

      expect(className).toBe('a b c d');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can be nested in @supports', () => {
      const className = renderer.renderRule({
        padding: '15px',
        '@supports (display: flex)': {
          '@media (max-width: 600px)': {
            padding: '15px',
          },
        },
      });

      expect(className).toBe('a b');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('sorts media queries using mobile-first (when using SSR)', () => {
      const block = { padding: 0 };
      const serverRenderer = new ServerRenderer();

      serverRenderer.renderRule({
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

      expect(
        getRenderedStyles(serverRenderer.sheetManager.getSheet('conditions')),
      ).toMatchSnapshot();
    });
  });

  describe('support queries', () => {
    it('supports @supports conditions', () => {
      const className = renderer.renderRule({
        display: 'block',
        '@supports (display: flex)': {
          display: 'flex',
        },
      });

      expect(className).toBe('a b');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });

    it('can be nested in @media', () => {
      const className = renderer.renderRule({
        display: 'block',
        '@media screen and (min-width: 900px)': {
          '@supports (display: flex)': {
            display: 'flex',
          },
        },
      });

      expect(className).toBe('a b');
      expect(getRenderedStyles('standard')).toMatchSnapshot();
      expect(getRenderedStyles('conditions')).toMatchSnapshot();
    });
  });
});
