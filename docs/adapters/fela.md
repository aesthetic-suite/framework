# Fela

Provides [Fela](https://github.com/rofrischmann/fela) support.

```javascript
import Aesthetic from 'aesthetic';
import FelaAdapter from 'aesthetic-adapter-fela';

const aesthetic = new Aesthetic(new FelaAdapter());
```

## Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import FelaAdapter from 'aesthetic-adapter-fela/unified';
```

## Configuration

Configuration, plugins, and enhancers can be defined by passing a new renderer
to `FelaAdapter`.

```javascript
import Aesthetic from 'aesthetic';
import FelaAdapter from 'aesthetic-adapter-fela';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';

const aesthetic = new Aesthetic(new FelaAdapter(createRenderer({
  plugins: [...webPreset],
  selectorPrefix: 'foo-',
})));
```
