import Renderer from '../src/Renderer';
import getInsertedStyles from '../src/helpers/getInsertedStyles';
import purgeStyles from './purgeStyles';

describe('Conditions', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  afterEach(() => {
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  });

  describe('media queries', () => {
    it('supports @media conditions', () => {
      const className = renderer.renderRule({
        background: '#000',
        padding: 15,
        '@media (max-width: 600px)': {
          padding: 15,
        },
        '@media screen and (min-width: 900px)': {
          padding: 20,
        },
      });

      expect(className).toBe('1yedsjc q1v28o 1l0h3j6 1d6vyr6');
      expect(getInsertedStyles('standard')).toMatchSnapshot();
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });

    it('can be nested in @supports', () => {
      const className = renderer.renderRule({
        padding: 15,
        '@supports (display: flex)': {
          '@media (max-width: 600px)': {
            padding: 15,
          },
        },
      });

      expect(className).toBe('q1v28o 1nadnnc');
      expect(getInsertedStyles('standard')).toMatchSnapshot();
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });

    it('sorts media queries on insert', () => {
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

      expect(getInsertedStyles('conditions')).toMatchSnapshot();
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

      expect(className).toBe('1s7hmty ku62hq');
      expect(getInsertedStyles('standard')).toMatchSnapshot();
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
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

      expect(className).toBe('1s7hmty xu0c72');
      expect(getInsertedStyles('standard')).toMatchSnapshot();
      expect(getInsertedStyles('conditions')).toMatchSnapshot();
    });
  });
});
