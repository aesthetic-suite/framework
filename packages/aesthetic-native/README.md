# Aesthetic with React Native

Provides [React Native](https://github.com/facebook/react-native) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

## Requirements

* React 15+
* React Native 0.40+
* Aesthetic

## Installation

```
npm install aesthetic aesthetic-native react-native --save
// Or
yarn add aesthetic aesthetic-native react-native
```

## Usage

React Native does not require an adapter, but does require a special instance of `Aesthetic`,
which is provided by this package, `aesthetic-native`.

```javascript
import Aesthetic from 'aesthetic-native';
import { createStyler } from 'aesthetic';

export default createStyler(new Aesthetic());
```

### Adapters

Adapters that support React Native can be passed to the `Aesthetic` instance.
The following adapters support React Native:

* [Fela](../aesthetic-adapter-fela/)

### Unified Syntax

React Native does not support Aesthetic's unified syntax, however, adapters may.
