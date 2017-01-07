# Aesthetic with Fela

Provides [Fela](https://github.com/rofrischmann/fela) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

## Requirements

* React 15+
* Aesthetic
* Fela

## Installation

```
npm install aesthetic aesthetic-adapter-fela fela fela-dom --save
// Or
yarn add aesthetic aesthetic-adapter-fela fela fela-dom
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import FelaAdapter from 'aesthetic-adapter-fela';

const aesthetic = new Aesthetic(new FelaAdapter());
```

### Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import FelaAdapter from 'aesthetic-adapter-fela/unified';
```

### Configuration

Renderer configuration, plugins, and enhancers can be defined by passing an object
to the `FelaAdapter`.

```javascript
import Aesthetic from 'aesthetic';
import FelaAdapter from 'aesthetic-adapter-fela';
import webPreset from 'fela-preset-web';

const aesthetic = new Aesthetic(new FelaAdapter({
  plugins: [...webPreset],
  selectorPrefix: 'foo-',
}));
```
