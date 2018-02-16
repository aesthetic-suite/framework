# JSS

Provides [JSS](https://github.com/cssinjs/jss) support.

```javascript
import Aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';

const aesthetic = new Aesthetic(new JSSAdapter());
```

## Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import JSSAdapter from 'aesthetic-adapter-jss/unified';
```

## Plugins

[JSS plugins](https://github.com/cssinjs/jss/blob/master/docs/plugins.md)
can be customized by instantiating a new JSS instance and passing it the adapter.

```javascript
import Aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';

const jss = create(preset());
const aesthetic = new Aesthetic(new JSSAdapter(jss));
```

## Configuration

Furthermore, options to be passed to `jss.createStyleSheet` can be defined through the
2nd argument of the constructor.

```javascript
import Aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';

const aesthetic = new Aesthetic(new JSSAdapter(null, {
  media: 'screen',
  // ...
});
```
