# JSS

Provides [JSS](https://github.com/cssinjs/jss) support.

```ts
import JSSAesthetic from 'aesthetic-adapter-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';
import { Theme } from './types';

const jss = create(preset());
const aesthetic = new JSSAesthetic<Theme>(jss);
```
