# JSS

Provides [JSS](https://github.com/cssinjs/jss) support.

```ts
import aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';

aesthetic.configure({
  adapter: new JSSAdapter(create(preset())),
});
```

## Installation

```
yarn add aesthetic aesthetic-adapter-jss jss jss-nested
// Or
npm install aesthetic aesthetic-adapter-jss jss jss-nested
```
