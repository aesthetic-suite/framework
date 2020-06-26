# CSS-in-JS format

The following format is provided when [compiling design tokens](../../design/tokens.md) for
CSS-in-JS solutions. It currently supports 3 different targets:

- `web-ts` for TypeScript.
- `web-js` for JavaScript using ECMA modules.
- `web-cjs` for JavaScript using CommonJS.

This format is different from other CSS-like formats, as it _does not_ generate a list of variables
(design tokens), but instead generates a design system and theme hierarchy composed of classes. This
layer is powered by the [@aesthetic/system](../../packages/system/README.md) package.

For the remainder of this documentation, we'll use TypeScript as our format.

## File structure

During compilation, an `index.ts` file will be created based on the design system YAML configuration
file. Additional `themes/<name>.ts` files will be created for each theme configured in the YAML
file.

This would look something like the following:

```
styles/<target>/
├── themes/
│   ├── day.ts
│   └── night.ts
└── index.ts
```

> JavaScript formats will use `.js` file extensions.

## Tokens

As mentioned above, a design system and multiple theme files are created. The design system file
defines primitive tokens through an exported `Design` class instance. Each theme file defines color
and palette tokens through an exported `Theme` class instance, while also inheriting all primitive
tokens from the parent design system.

The compiled design system file looks something like the following:

```js
import { Design } from '@aesthetic/core';

export default new Design('example', {
  border: {
    sm: {
      radius: '0.11rem', // 1.50px
      width: '0rem', // 0px
    },
    df: {
      radius: '0.21rem', // 3px
      width: '0.07rem', // 1px
    },
    lg: {
      radius: '0.32rem', // 4.50px
      width: '0.14rem', // 2px
    },
  },
  breakpoint: {
    xs: {
      query: '(min-width: 45.71em)',
      querySize: 640,
      rootLineHeight: 1.33,
      rootTextSize: '14.94px',
    },
    sm: {
      query: '(min-width: 68.57em)',
      querySize: 960,
      rootLineHeight: 1.42,
      rootTextSize: '15.94px',
    },
    md: {
      query: '(min-width: 91.43em)',
      querySize: 1280,
      rootLineHeight: 1.52,
      rootTextSize: '17.01px',
    },
    lg: {
      query: '(min-width: 114.29em)',
      querySize: 1600,
      rootLineHeight: 1.62,
      rootTextSize: '18.15px',
    },
    xl: {
      query: '(min-width: 137.14em)',
      querySize: 1920,
      rootLineHeight: 1.73,
      rootTextSize: '19.36px',
    },
  },
  heading: {
    l1: {
      letterSpacing: '0.25px',
      lineHeight: 1.5,
      size: '1.14rem', // 16px
    },
    l2: {
      letterSpacing: '0.33px',
      lineHeight: 1.69,
      size: '1.43rem', // 20px
    },
    l3: {
      letterSpacing: '0.44px',
      lineHeight: 1.9,
      size: '1.79rem', // 25px
    },
    l4: {
      letterSpacing: '0.59px',
      lineHeight: 2.14,
      size: '2.23rem', // 31.25px
    },
    l5: {
      letterSpacing: '0.79px',
      lineHeight: 2.4,
      size: '2.79rem', // 39px
    },
    l6: {
      letterSpacing: '1.05px',
      lineHeight: 2.7,
      size: '3.49rem', // 48.80px
    },
  },
  shadow: {
    xs: {
      x: '0rem', // 0px
      y: '0.14rem', // 2px
      blur: '0.14rem', // 2px
      spread: '0rem', // 0px
    },
    sm: {
      x: '0rem', // 0px
      y: '0.23rem', // 3.24px
      blur: '0.27rem', // 3.75px
      spread: '0rem', // 0px
    },
    md: {
      x: '0rem', // 0px
      y: '0.37rem', // 5.24px
      blur: '0.39rem', // 5.50px
      spread: '0rem', // 0px
    },
    lg: {
      x: '0rem', // 0px
      y: '0.61rem', // 8.47px
      blur: '0.52rem', // 7.25px
      spread: '0rem', // 0px
    },
    xl: {
      x: '0rem', // 0px
      y: '0.98rem', // 13.71px
      blur: '0.64rem', // 9px
      spread: '0rem', // 0px
    },
  },
  spacing: {
    xs: '0.31rem', // 4.38px
    sm: '0.63rem', // 8.75px
    df: '1.25rem', // 17.50px
    md: '2.50rem', // 35px
    lg: '3.75rem', // 52.50px
    xl: '5rem', // 70px
    type: 'vertical-rhythm',
    unit: 17.5,
  },
  text: {
    sm: {
      lineHeight: 1.25,
      size: '0.89rem', // 12.45px
    },
    df: {
      lineHeight: 1.25,
      size: '1rem', // 14px
    },
    lg: {
      lineHeight: 1.25,
      size: '1.13rem', // 15.75px
    },
  },
  typography: {
    font: {
      heading: 'Roboto',
      locale: {},
      monospace: '"Lucida Console", Monaco, monospace',
      text: 'Roboto',
      system:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    rootLineHeight: 1.25,
    rootTextSize: '14px',
  },
});
```

While the compiled theme files look loosely like this (removed some repetition for brevity):

```js
import design from '..';

export default design.createTheme(
  {
    contrast: 'normal',
    scheme: 'light',
  },
  {
    palette: {
      brand: {
        color: {
          '00': '#eceff1',
          '10': '#cfd8dc',
          '20': '#b0bec5',
          '30': '#90a4ae',
          '40': '#78909c',
          '50': '#607d8b',
          '60': '#546e7a',
          '70': '#455a64',
          '80': '#37474f',
          '90': '#263238',
        },
        bg: {
          base: '#78909c',
          disabled: '#90a4ae',
          focused: '#607d8b',
          hovered: '#546e7a',
          selected: '#607d8b',
        },
        fg: {
          base: '#546e7a',
          disabled: '#607d8b',
          focused: '#455a64',
          hovered: '#37474f',
          selected: '#455a64',
        },
      },
      primary: {
        // ...
      },
      secondary: {
        // ...
      },
      tertiary: {
        // ...
      },
      neutral: {
        // ...
      },
      muted: {
        // ...
      },
      info: {
        // ...
      },
      warning: {
        // ...
      },
      danger: {
        // ...
      },
      success: {
        // ...
      },
    },
  },
);
```

## Mixins

Coming soon...

## Usage

Token values can be accessed from both `Design` and `Theme` instances using the `tokens` class
property, which is a multidimensional object.

```js
import design from './styles/<target>';
import theme from './styles/<target>/themes/day';

design.tokens.heading.l3.size; // 1.79rem
theme.tokens.palette.brand.color['30']; // #90a4ae
```

There are far more advanced ways of utilizing design tokens. We suggest reading the documentation on
the [design system package](../../packages/system/README.md) itself for more examples.
