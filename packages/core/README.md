# Aesthetic

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)
[![npm version](https://badge.fury.io/js/aesthetic.svg)](https://www.npmjs.com/package/aesthetic)
[![npm deps](https://david-dm.org/milesj/aesthetic.svg?path=packages/core)](https://www.npmjs.com/package/aesthetic)

Aesthetic is a powerful type-safe React library for styling components, whether it be CSS-in-JS
using style objects, importing style sheets, or simply referencing external class names. Simply put,
Aesthetic is an abstraction layer that utilizes higher-order-components for the compilation of
styles via third-party libraries, all the while providing customizability, theming, and a unified
syntax.

Supports both an HOC and hook styled API!

```tsx
import React from 'react';
import withStyles, { WithStylesProps } from './withStyles';
import cx from './cx';

export type Props = {
  children: React.ReactNode;
};

function Button({ children, styles }: Props & WithStylesProps) {
  return (
    <button type="button" className={cx(styles.button)}>
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

- React 16.3+ (16.8 if using hooks)
- IE 11+

## Installation

```
yarn add aesthetic react
// Or
npm install aesthetic react
```

## Documentation

[https://milesj.gitbook.io/aesthetic](https://milesj.gitbook.io/aesthetic)
