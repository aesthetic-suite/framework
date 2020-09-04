# Aesthetic - Core API

[![Build Status](https://github.com/aesthetic-suite/framework/workflows/Build/badge.svg)](https://github.com/aesthetic-suite/framework/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40aesthetic%core.svg)](https://www.npmjs.com/package/@aesthetic/core)
[![npm deps](https://david-dm.org/aesthetic-suite/framework.svg?path=packages/core)](https://www.npmjs.com/package/@aesthetic/core)

Unifies a [design system](https://www.npmjs.com/package/@aesthetic/system), a
[CSS-in-JS engine](https://www.npmjs.com/package/@aesthetic/style), and a
[style sheet structure](https://www.npmjs.com/package/@aesthetic/sss), into a powerful framework
agnostic API.

```ts
import {
  configure,
  registerDefaultTheme,
  registerTheme,
  createComponentStyles,
} from '@aesthetic/core';
import dayTheme from './design/system/dayTheme';
import nightTheme from './design/system/nightTheme';

// Define global options (defaults below)
configure({
  defaultUnit: 'px',
  deterministicClasses: false,
  vendorPrefixes: false,
});

// Register a theme (provided by the design system)
registerDefaultTheme('day', dayTheme);

// Register a theme that has global styles
registerTheme('night', nightTheme, (css) => ({
  '@root': css.mixin('root', {
    backgroundColor: css.var('palette-neutral-bg-base'),
    height: '100%',
  }),
}));

// Create a component style sheet
const styleSheet = createComponentStyles((css) => ({
  button: {
    textAlign: 'center',
    display: 'inline-block',
    padding: css.var('spacing-df'),
  },
}));

// Render the style sheet into the document
const classNames = renderComponentStyles(styleSheet);
```

> Though the core API is framework agnostic and can be used stand-alone, it's encouraged to use a
> framework integration package for better ergonomics.

## Features

Supports all features provided by unified packages, while also providing...

- Register, manage, and activate themes, powered by the design system.
- Automatically activates a theme based on a users preferences (color scheme, contrast, etc).
- Scopes active theme styles and CSS variables to the body to avoid global scope pollution.
- Factories and renders component and theme style sheets.
- Supports color scheme, contrast, and theme variants for style sheets.
- Renders font faces, keyframes, and CSS imports.
- Handles server-side rendering _and_ client-side hydration.
- Integrates with the [React](https://www.npmjs.com/package/@aesthetic/react) framework.

## Requirements

- IE 11+

## Installation

```
yarn add @aesthetic/core
```

## Documentation

[https://aestheticsuite.dev](https://aestheticsuite.dev)
