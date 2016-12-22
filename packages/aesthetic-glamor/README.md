# Aesthetic with Glamor

Provides [Glamor](https://github.com/threepointone/glamor) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

## Requirements

* React 15+
* Aesthetic
* Glamor

## Installation

```
npm install aesthetic aesthetic-glamor glamor --save
// Or
yarn add aesthetic aesthetic-glamor glamor
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import GlamorAdapter from 'aesthetic-glamor';

const aesthetic = new Aesthetic(new GlamorAdapter());
```

[Glamor plugins](https://github.com/threepointone/glamor/blob/master/docs/plugins.md)
can be added before the adapter is instantiated.

```javascript
import GlamorAdapter from 'aesthetic-glamor';
import { plugins } from 'glamor';

plugins.add(plugin);

new GlamorAdapter(); // ...
```
