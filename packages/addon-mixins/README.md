# Aesthetic - Design System Mixins

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%addon-mixins.svg)](https://www.npmjs.com/package/@aesthetic/addon-mixins)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/addon-mixins)](https://www.npmjs.com/package/@aesthetic/addon-mixins)

CSS-in-JS mixins for the Aesthetic design system.

```ts
import mixins from '@aesthetic/addon-mixins';
import { Design } from '@aesthetic/system';

// Configure design system with mixins
const design = new Design(
  'dls',
  {
    /* ... */
  },
  mixins,
);

// Generate CSS properties from theme
const theme = design.createTheme(
  { contrast: 'normal', scheme: 'light' },
  {
    /* ... */
  },
);

const css = theme.mixin('background', { palette: 'positive' }, { borderWidth: 1 });

// OR with type safety
const css = theme.mixin.background({ palette: 'positive' }, { borderWidth: 1 });
```

## Installation

```
yarn add @aesthetic/addon-mixins
```

## Documentation

[https://aestheticsuite.dev](https://aestheticsuite.dev)
