# Aesthetic with TypeStyle

Provides [TypeStyle](https://github.com/threepointone/typestyle) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

## Requirements

* React 15+
* Aesthetic
* TypeStyle

## Installation

```
npm install aesthetic aesthetic-adapter-typestyle typestyle --save
// Or
yarn add aesthetic aesthetic-adapter-typestyle typestyle
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic';
import TypeStyleAdapter from 'aesthetic-adapter-typestyle';

const aesthetic = new Aesthetic(new TypeStyleAdapter());
```

### Unified Syntax

To make use of the unified syntax, simply import the adapter from the unified path.

```javascript
import TypeStyleAdapter from 'aesthetic-adapter-typestyle/unified';
```
