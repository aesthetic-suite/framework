# Aesthetic

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)

Aesthetic is a powerful type-safe React library for styling components, whether it be CSS-in-JS
using style objects, importing stylesheets, or simply referencing external class names. Simply put,
Aesthetic is an abstraction layer that utilizes higher-order-components for the compilation of
styles via third-party libraries, all the while providing customizability, theming, and a unified
syntax.

```tsx
import React from 'react';
import withStyles, { WithStylesProps, classes } from '../path/to/aesthetic';

export type Props = {
  children: React.ReactNode;
};

function Button({ children, styles }: Props & WithStylesProps) {
  return (
    <button type="button" className={classes(styles.button)}>
      {children}
    </button>
  );
}

export default withStyles(({ unit }) => ({
  button: {
    textAlign: 'center',
    display: 'inline-block',
    padding: unit,
  },
}))(Button);
```

## Requirements

- React 16.3+
- IE 10+
- `WeakMap`

## Installation

Aesthetic requires React as a peer dependency.

```
yarn add aesthetic react
// Or
npm install aesthetic react
```

## Documentation

[https://milesj.gitbook.io/aesthetic](https://milesj.gitbook.io/aesthetic)
