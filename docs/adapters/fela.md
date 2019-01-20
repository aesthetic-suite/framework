# Fela

Provides [Fela](https://github.com/rofrischmann/fela) support.

```ts
import FelaAesthetic from 'aesthetic-adapter-fela';
import { createRenderer } from 'fela';
import webPreset from 'fela-preset-web';
import { Theme } from './types';

const fela = createRenderer({ plugins: [...webPreset] });
const aesthetic = new FelaAesthetic<Theme>(fela, options);
```
