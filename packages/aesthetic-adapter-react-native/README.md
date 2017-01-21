# Aesthetic with React Native

Provides [React Native](https://github.com/facebook/react-native) support for
[Aesthetic](https://github.com/milesj/aesthetic), a React styling library.

> The [aesthetic-native](https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-native)
> library is also required for React Native support.

## Requirements

* React 15+
* React Native 0.40+
* Aesthetic

## Installation

```
npm install aesthetic aesthetic-native aesthetic-adapter-react-native react-native --save
// Or
yarn add aesthetic aesthetic-native aesthetic-adapter-react-native react-native
```

## Usage

More information on how to get started can be found in the
[official documentation](https://github.com/milesj/aesthetic).

```javascript
import Aesthetic from 'aesthetic-native';
import ReactNativeAdapter from 'aesthetic-adapter-react-native';

const aesthetic = new Aesthetic(new ReactNativeAdapter());
```

### Unified Syntax

React Native supports a portion of the unified syntax, with the biggest outliers being
font faces and animations, both of which should be handled by iOS/Android or React Native itself.

```javascript
import ReactNativeAdapter from 'aesthetic-adapter-react-native/unified';
```

By default, Aesthetic will throw errors if a font face or animation keyframe is detected.
To silence these errors, pass a boolean `silence` to the adapter.

```javascript
new ReactNativeAdapter({ silence: true })
```
