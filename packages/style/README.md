# Aesthetic - CSS-in-JS Style Engine

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%style.svg)](https://www.npmjs.com/package/@aesthetic/style)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/style)](https://www.npmjs.com/package/@aesthetic/style)

A low-level, high-performance, atomic-based CSS-in-JS solution. Can be used stand-alone but has been
designed to power additional abstractions or APIs.

```ts
import { ClientRenderer } from '@aesthetic/style';

// Instantiate a client side renderer
const renderer = new ClientRenderer();

// Render a style decleration into individual atomic class names
const className = renderer.renderRule({
  '--color': 'black',

  margin: 0,
  padding: '6px 12px',
  textAlign: 'center',
  color: 'var(--color)',
  backgroundColor: 'transparent',
  border: '2px solid #eee',

  ':hover': {
    borderColor: '#fff',
  },

  '@media (max-width: 600px)': {
    display: 'block',
  },
}); // -> a b c d e f g h
```

## Features

- 5.8kb minified and gzipped (35.4kb original).
- Atomic based CSS. One declaration per class name.
- Specificity ranking so the intended property is always rendered.
- Font faces, keyframes, imports, and other globals are rendered before normal declarations.
- Media and support queries are grouped and rendered after normal declarations.
- Media queries are sorted mobile-first.
- Injection buffering for increased performance and reduced paints.
- Style declarations support pseudos, attributes, conditional at-rules, and nested declarations.
- Deterministic or atomic incremental CSS class names.
- Right-to-left (RTL) integration (with addon).
- Vendor prefixing for browsers with >= 1% market share (with addon).
- Unit suffixing for numerical values.
- First-class CSS variables support.
- Server-side rendering _and_ client-side hydration.
- Framework and library agnostic. Can be used stand-alone.

## Installation

```
yarn add @aesthetic/style
```

## Documentation

[https://aestheticsuite.dev/docs/packages/style](https://aestheticsuite.dev/docs/packages/style)
