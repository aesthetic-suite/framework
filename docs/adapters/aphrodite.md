# Aphrodite

Provides [Aphrodite](https://github.com/Khan/aphrodite) support.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import { Theme } from './types';

const aesthetic = new AphroditeAesthetic<Theme>(extensions, options);
```

## Installation

```
yarn add aesthetic aesthetic-adapter-aphrodite aphrodite
// Or
npm install aesthetic aesthetic-adapter-aphrodite aphrodite
```

## Custom Selectors

Aphrodite does not support some core CSS functionality, so Aesthetic has filled in these gaps. The
following examples are supported out of the box.

Attribute and child combinator selectors.

```js
{
  button: {
    '[disabled]': {
      opacity: 0.3,
    },
  },
  list: {
    '@selectors': {
      '> li': {
        listStyle: 'none',
      },
    },
  },
}
```

Global styles (to easily style `body`, `a`, and others).

```js
{
  '@global': {
    body: { margin: 0 },
    html: { height: '100%' },
    a: {
      color: 'red',
      ':hover': {
        color: 'darkred',
      },
    },
  },
}
```

> Global styles must be passed to `Aesthetic#registerTheme()`.

## Extensions

[Aphrodite extensions](https://github.com/Khan/aphrodite#advanced-extensions) can be customized by
passing an array of extensions to the constructor.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import { Theme } from './types';

const aesthetic = new AphroditeAesthetic<Theme>([
  extension1,
  extension2,
  // ...
]);
```
