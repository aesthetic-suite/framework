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
