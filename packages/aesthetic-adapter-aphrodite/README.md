# Aesthetic with Aphrodite

Provides [Aphrodite](https://github.com/Khan/aphrodite) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

> This adapter does not support combination [override styles](https://github.com/Khan/aphrodite#overriding-styles),
> as styles are compiled in the background. To work around this,
> define your style declarations in the proper specificity order.

## Requirements

* React 15+
* Aesthetic
* Aphrodite

## Installation

```
npm install aesthetic aesthetic-adapter-aphrodite aphrodite --save
// Or
yarn add aesthetic aesthetic-adapter-aphrodite aphrodite
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';

const aesthetic = new Aesthetic(new AphroditeAdapter());
```

### Custom Selectors

Aphrodite does not support some core CSS functionality, so Aesthetic has filled in these gaps.
The following examples are supported by default.

Attribute and direct descendant selectors.

```javascript
{
  button: {
    '[disabled]': {
      opacity: 0.3,
    },
  },
  list: {
    '> li': {
      listStyle: 'none',
    },
  },
}
```

Global styles (to easily style `body`, `a`, and others). Selectors must be prefixed with `*`.

```javascript
{
  globals: {
    '*body': { margin: 0 },
    '*html': { height: '100%' },
    '*a': {
      color: 'red',
      ':hover': {
        color: 'darkred',
      },
    },
  },
}
```

> Global styles should be passed to `Aesthetic#registerTheme()`.

### Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import AphroditeAdapter from 'aesthetic-adapter-aphrodite/unified';
```

### Extensions

[Aphrodite extensions](https://github.com/Khan/aphrodite#advanced-extensions)
can be customized by passing an array of extensions to the constructor.

```javascript
import Aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';

const aesthetic = new Aesthetic(new AphroditeAdapter([
  extension1,
  extension2,
  // ...
]));
```
