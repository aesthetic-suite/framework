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

One key difference between React Native Aesthetic and normal Aesthetic is that React Native
styles are passed down to the component under the `styles` prop, instead of `classNames`.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { StylesPropType } from 'aesthetic';
import style from '../path/to/styler';

function Button({ children, styles, icon }) {
  return (
    <button type="button" style={styles.button}>
      {icon && (
        <span style={[styles.icon]}>{icon}</span>
      )}

      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  styles: StylesPropType,
  icon: PropTypes.node,
};

export default style({
  button: { ... },
  icon: { ... }
})(Button);
```

### Supported Adapters

Adapters that support React Native can be passed to the `Aesthetic` instance.

* [Fela](../aesthetic-adapter-fela/)

### Unified Syntax

React Native does not support Aesthetic's unified syntax.
