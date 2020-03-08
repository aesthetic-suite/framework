import Design from '../src/Design';
import Theme from '../src/Theme';
import { design, lightTheme } from '../src/testing';

describe('Design', () => {
  it('sets class properties', () => {
    expect(design.rootLineHeight).toBe(1.25);
    expect(design.rootTextSize).toBe(14);
    expect(design.spacingUnit).toBe(17.5);
  });

  it('can return a theme instance', () => {
    const theme = design.createTheme({ contrast: 'normal', scheme: 'light' }, lightTheme.tokens);

    expect(theme).toBeInstanceOf(Theme);
  });

  it('can extend and create a new design', () => {
    const newDesign = design.extend({
      spacing: {
        unit: 8,
      },
      text: {
        df: {
          size: '20px',
        },
      },
    });

    expect(newDesign).toBeInstanceOf(Design);
    expect(newDesign.tokens.spacing.unit).toBe(8);
    expect(newDesign.tokens.text.df.size).toBe('20px');
  });
});
