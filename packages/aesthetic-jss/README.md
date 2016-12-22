# Aesthetic with JSS

Provides [JSS](https://github.com/cssinjs/jss) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

## Requirements

* React 15+
* Aesthetic
* JSS

## Installation

```
npm install aesthetic aesthetic-jss jss --save
// Or
yarn add aesthetic aesthetic-jss jss
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import JSSAdapter from 'aesthetic-jss';

const aesthetic = new Aesthetic(new JSSAdapter());
```

[JSS plugins](https://github.com/cssinjs/jss/blob/master/docs/plugins.md)
can be customized by instantiating a new JSS instance and passing it the adapter.

```javascript
import JSSAdapter from 'aesthetic-jss';
import { create } from 'jss';
import preset from 'jss-preset-default';

const jss = create();
jss.use(preset());

new JSSAdapter(jss); // ...
```
