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

### Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import AphroditeAdapter from 'aesthetic-adapter-aphrodite/unified';
```

### Extensions

[Aphrodite extensions](https://github.com/Khan/aphrodite#advanced-extensions)
can be customized by passing an instance of `StyleSheet` to the adapter.

```javascript
import Aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';
import { StyleSheet } from 'aphrodite';

const aesthetic = new Aesthetic(new AphroditeAdapter(StyleSheet.extend([
  extension1,
  extension2,
  // ...
])));
```

### No !Important Mode

Like extensions, [no !important mode](https://github.com/Khan/aphrodite#disabling-important) can
be used by importing the the `no-important` path.

```javascript
import Aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';
import { StyleSheet } from 'aphrodite/no-important';

const aesthetic = new Aesthetic(new AphroditeAdapter(StyleSheet));
```
