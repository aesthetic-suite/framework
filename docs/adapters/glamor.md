# Glamor

Provides [Glamor](https://github.com/threepointone/glamor) support.

```javascript
import Aesthetic from 'aesthetic';
import GlamorAdapter from 'aesthetic-adapter-glamor';

const aesthetic = new Aesthetic(new GlamorAdapter());
```

## Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import GlamorAdapter from 'aesthetic-adapter-glamor/unified';
```

## Plugins

[Glamor plugins](https://github.com/threepointone/glamor/blob/master/docs/plugins.md) can be added
before the adapter is instantiated.

```javascript
import Aesthetic from 'aesthetic';
import GlamorAdapter from 'aesthetic-adapter-glamor';
import { plugins } from 'glamor';

plugins.add(plugin); // ...

const aesthetic = new Aesthetic(new GlamorAdapter());
```
