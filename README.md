# Aesthetic

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
[![npm version](https://badge.fury.io/js/aesthetic.svg)](https://www.npmjs.com/package/aesthetic)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/core)](https://www.npmjs.com/package/aesthetic)

Aesthetic is a powerful type-safe, framework agnostic, CSS-in-JS library for styling components,
whether it be with plain objects, importing style sheets, or simply referencing external class
names. Simply put, Aesthetic is an abstraction layer for the compilation of styles via third-party
libraries, all the while providing customizability, theming, additional features, and a unified
syntax.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import { Theme } from './types';

const aesthetic = new AphroditeAesthetic<Theme>();

// Register a theme
aesthetic.registerTheme('light', {
  unit: 8,
});

// Register a style sheet definition for a component
aesthetic.registerStyleSheet('button', ({ unit }) => ({
  button: {
    textAlign: 'center',
    display: 'inline-block',
    padding: unit,
  },
}));

// Parse the styles and generate CSS class names
const styles = aesthetic.createStyleSheet('button');
const className = aesthetic.transformStyles(styles.button);
```

## React

Supports both an HOC and hook styled React API!

```tsx
import React from 'react';
import useStyles from './useStyles';

export type Props = {
  children: React.ReactNode;
};

export default function Button({ children }: Props) {
  const [styles, cx] = useStyles(({ unit }) => ({
    button: {
      textAlign: 'center',
      display: 'inline-block',
      padding: unit,
    },
  }));

  return (
    <button type="button" className={cx(styles.button)}>
      {children}
    </button>
  );
}
```

## Requirements

- IE 11+

## Installation

```
yarn add aesthetic
// Or
npm install aesthetic
```

## Documentation

[https://milesj.gitbook.io/aesthetic](https://milesj.gitbook.io/aesthetic)
