# Aesthetic with JSS

Provides [JSS](https://github.com/cssinjs/jss) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

## Requirements

* React 15+
* Aesthetic
* JSS

## Installation

```
npm install aesthetic aesthetic-adapter-jss jss --save
// Or
yarn add aesthetic aesthetic-adapter-jss jss
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';

const aesthetic = new Aesthetic(new JSSAdapter());
```

### Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import JSSAdapter from 'aesthetic-adapter-jss/unified';
```

### Plugins

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

### Configuration

Furthermore, options to be passed to `jss.createStyleSheet` can be defined through the
second argument of the constructor.

```javascript
import Aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss';

const aesthetic = new Aesthetic(new JSSAdapter(null, {
  media: 'screen',
  // ...
});
```
