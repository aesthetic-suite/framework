# CSS Modules

Provides [CSS Modules](https://github.com/css-modules/css-modules) support.

```ts
import CSSModulesAesthetic from 'aesthetic-adapter-css-modules';

const aesthetic = new CSSModulesAesthetic(options);
```

> This library does not enable CSS modules, it simply applies the class names to the React
> component. Supporting CSS modules will need to be enabled with
> [Webpack](https://github.com/webpack/css-loader) or
> [Babel](https://github.com/michalkvasnicak/babel-plugin-css-modules-transform).

## Unified Syntax

CSS modules do not support Aesthetic's unified syntax.

## Usage

When defining styles for a React component, pass the CSS modules object to the `withStyles` HOC
function, instead of setting the element `className` props directly.

```ts
import React from 'react';
import withStyles from '../path/to/aesthetic';
import styles from './styles.css';

function Component() {
  // ...
}

export default withStyles(() => styles)(Component);
```
