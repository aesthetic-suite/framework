import { Design } from '../src';

function createState() {
  return {
    bg: {
      base: 'red.40',
      disabled: 'red.00',
      hovered: 'red.60',
      focused: 'red.50',
      selected: 'red.50',
    },
    fg: {
      base: 'red.40',
      disabled: 'red.00',
      hovered: 'red.60',
      focused: 'red.50',
      selected: 'red.50',
    },
  };
}

describe('Design', () => {
  it('works', () => {
    const a = new Design<'red'>({
      colors: ['red'],
      spacing: {
        type: 'unit',
      },
    });

    const b = new Design({
      colors: ['red'],
      strategy: 'desktop-first',
      typography: {
        fontSize: 20,
      },
    });

    console.log(a.tokens);
    console.log(b.tokens);

    const t = a.createTheme({
      colors: {
        red: {
          '00': '#FE8484',
          10: '#FE8484',
          20: '#FE8484',
          30: '#FE8484',
          40: '#FE8484',
          50: '#FE8484',
          60: '#FE8484',
          70: '#FE8484',
          80: '#FE8484',
          90: '#FE8484',
        },
      },
      palettes: {
        primary: {
          bg: {
            base: 'red.00',
          },
          fg: {
            base: 'red.10',
          },
        },
        secondary: createState(),
        tertiary: createState(),
        neutral: createState(),
        info: createState(),
        warning: createState(),
        success: createState(),
        danger: createState(),
        muted: createState(),
      },
      scheme: 'light',
    });

    console.log(t.tokens.palette);

    expect(true).toBe(true);
  });
});
