# TypeStyle

Provides [TypeStyle](https://github.com/threepointone/typestyle) support.

```ts
import aesthetic from 'aesthetic';
import TypeStyleAdapter from 'aesthetic-adapter-typestyle';
import { TypeStyle } from 'typestyle';

aesthetic.configure({
  adapter: new TypeStyleAdapter(new TypeStyle({ autoGenerateTag: true })),
});
```

## Installation

```
yarn add aesthetic aesthetic-adapter-typestyle typestyle
// Or
npm install aesthetic aesthetic-adapter-typestyle typestyle
```
