# CSS Modules

Provides [CSS Modules](https://github.com/css-modules/css-modules) support.

```javascript
import Aesthetic from 'aesthetic';
import CSSModulesAdapter from 'aesthetic-adapter-css-modules';

const aesthetic = new Aesthetic(new CSSModulesAdapter());
```

> This library does not enable CSS modules, it simply applies the class names to the
> React component. Supporting CSS modules will need to be enabled with
> [Webpack](https://github.com/webpack/css-loader) or
> [Babel](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform).

## Unified Syntax

CSS modules do not support Aesthetic's unified syntax.

## Usage

When defining styles for a React component, simply pass the CSS modules object to
the styler function, instead of setting the element `className` props directly.

```javascript
import React from 'react';
import style from '../path/to/styler';
import styles from './styles.css';

function Component() {
  // ...
}

export default style(styles)(Component);
```
