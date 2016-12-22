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
npm install aesthetic aesthetic-aphrodite aphrodite --save
// Or
yarn add aesthetic aesthetic-aphrodite aphrodite
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-aphrodite';

const aesthetic = new Aesthetic(new AphroditeAdapter());
```

[Aphrodite extensions](https://github.com/Khan/aphrodite#advanced-extensions)
can be customized by passing an instance of `StyleSheet` to the adapter.

```javascript
import AphroditeAdapter from 'aesthetic-aphrodite';
import { StyleSheet } from 'aphrodite';

new AphroditeAdapter(StyleSheet.extend([extension1, extension2])); // ...
```

As well as [no important](https://github.com/Khan/aphrodite#disabling-important) support.

```javascript
import AphroditeAdapter from 'aesthetic-aphrodite';
import { StyleSheet } from 'aphrodite/no-important';

new AphroditeAdapter(StyleSheet); // ...
```
