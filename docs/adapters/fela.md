# Fela

Provides [Fela](https://github.com/rofrischmann/fela) support.

```ts
import aesthetic from 'aesthetic';
import FelaAdapter from 'aesthetic-adapter-fela';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';

aesthetic.configure({
  adapter: new FelaAdapter(createRenderer({ plugins: [...webPreset] })),
});
```

## Installation

```
yarn add aesthetic aesthetic-adapter-fela fela fela-dom
// Or
npm install aesthetic aesthetic-adapter-fela fela fela-dom
```
