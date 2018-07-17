# Aesthetic

[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)

Aesthetic is a powerful React library for styling components, whether it be CSS-in-JS using style
objects, importing stylesheets, or simply referencing external class names. Simply put, Aesthetic is
an abstraction layer that utilizes higher-order-components for the compilation of styles via
third-party libraries, all the while providing customizability, theming, and a unified syntax.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { StylesPropType } from 'aesthetic';
import withStyles, { classes } from '../path/to/styler';

function Button({ children, styles }) {
  return (
    <button type="button" className={classes(styles.button)}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  styles: StylesPropType.isRequired,
};

export default withStyles(({ unit }) => ({
  button: {
    textAlign: 'center',
    display: 'inline-block',
    padding: unit,
  },
}))(Button);
```

## Requirements

- React 15/16+
- IE 10+
- `WeakMap`

## Installation

Aesthetic requires React as a peer dependency.

```
npm install aesthetic react --save
// Or
yarn add aesthetic react
```

## Documentation

[https://milesj.gitbook.io/aesthetic](https://milesj.gitbook.io/aesthetic)
