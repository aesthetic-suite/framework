# Aesthetic v0.0.2
[![Build Status](https://travis-ci.org/milesj/aesthetic.svg?branch=master)](https://travis-ci.org/milesj/aesthetic)

Abstract library to support a range of styling options for React components.

## Usage

How to use this library.

### Base Component

The base component, an abstract component with default styles,
one which all consumers compose around.

Is usually provided by a third-party library, like Toolkit,
or simply defined and consumed directly within an application.

Say we're using a third-party library, like Toolkit, which provides
and styles this reusable `Button` component.

```javascript
function Button({ children, styles }) {
  return (
    <button className={styles.button}>{children}</button>
  );
}

export default style({
  button: {
    display: 'inline-block',
    padding: 5,
  },
})(Button);
```

Now, if I consume this library, how can I customize the styles of this button?
What if I want to use class names? Or change the name of existing class names?
What about a theme? Etc.

### Overriding Default Styles

All base components can have their styles overridden by the consumer, like so.
This can only be done once in an effort to promote strict isolation and encapsulation.
Style overriding can also be disabled all together.

```javascript
import Button from 'toolkit/components/Button';

Button.setStyles({
  button: {
    padding: '5px 10px',
    fontWeight: 'bold',
  },
});

// Or merge with the default styles
Button.mergeStyles({ ... });
```

And done. We now have a `Button` component that is styled to our application.

We can take this a step further, if need be, by wrapping the base component
with a custom component.

### Composed Component

Say we want to execute some logic, or prepare props, before rendering the base button.
We can do this by wrapping the base component with our own component.

```javascript
import BaseButton from 'toolkit/components/Button';

// Set styles like before
BaseButton.setStyles({ ... });

export default function Button({ children, ...props }) {
  // Do something

  return (
    <BaseButton {...props}>{children}</BaseButton>
  );
}
```

## Documentation

* [Initial Setup](#initial-setup)
  * [Webpack](#webpack)
  * [Browserify](#browserify)
* [CSS Adapters](#css-adapters)
* [Creating A Styler](#creating-a-styler)
* [Styling Components](#styling-components)
* [Using Themes](#using-themes)
* [Unified Syntax](#unified-syntax)
  * [Properties](#properties)
  * [Pseudos](#pseudos)
  * [Fallbacks](#fallbacks)
  * [Media Queries](#media-queries)
  * [Font Faces](#font-faces)
  * [Animations](#animations)
  * [Selectors](#selectors)

### Initial Setup

Aesthetic makes heavy use of `process.env.NODE_ENV` for logging errors in development.
These errors will be entirely removed in production if the following build steps are configured.

#### Webpack

[DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) plugin
is required when using Webpack.

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
}),
```

#### Browserify

[Envify](https://github.com/hughsk/envify) transformer is required when using Browserify.

```javascript
envify({
  NODE_ENV: 'production',
});
```

### CSS Adapters

An adapter in the context of Aesthetic is a third-party library that supports CSS in JavaScript,
whether it be injecting CSS styles based off JavaScript objects, importing CSS during a build
process, or simply referencing CSS class names.

The following libraries and their features are officially supported by Aesthetic.

| Adapter | Unified Syntax | Pseudos | Fallbacks | Fonts | Animations | Media Queries |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| [CSS class names](#styling-components) | | ✓ | ✓ | ✓ | ✓ | ✓ |
| [CSS modules][css-modules] | | ✓ | ✓ | ✓ | ✓ | ✓ |
| [Aphrodite][aphrodite] | ✓ | ✓ | | ✓ | ✓ | ✓ |
| [Glamor][glamor] | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| [JSS][jss] | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

And the following libraries are not supported.

* [CSSX](https://github.com/krasimir/cssx) -
  Does not generate unique class names during compilation and instead
  uses the literal class names and or tag names defined in the style declaration.
  This allows for global style collisions, which we want to avoid.
* [Radium](https://github.com/FormidableLabs/radium) -
  Uses inline styles instead of compiling class names and attaching CSS styles to the DOM.

### Creating A Styler

To start using Aesthetic, a styler function must be created. This styler function
acts as a factory for the creation of higher-order-components
([HOC](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)).
These HOC's are used in transforming styles from adapters and passing down CSS
class names to the original wrapped component.

To begin, we must create an instance of `Aesthetic` with an [adapter](#css-adapters),
pass it to `createStyler`, and export the new function. I suggest doing this an a file
that can be imported for reusability.

```javascript
// style.js
import Aesthetic, { createStyler } from 'aesthetic';
import JSSAdapter from 'aesthetic-jss'; // Or your chosen adapter

const aesthetic = new Aesthetic(new JSSAdapter());

export default createStyler(aesthetic);
```

Once we have a styler function, we can import it and wrap our React components.

```javascript
// Button.js
import React, { PropTypes } from 'react';
import { ClassNamesShape } from 'aesthetic';
import style from '../path/to/style';

function Button({ children, classNames }) {
  return (
    <button type="button" className={classNames.button}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  classNames: ClassNamesShape,
};

export default style({
  button: {
    display: 'inline-block',
    padding: [5, 10],
    // ...
  },
})(Button);
```

The styler function accepts a [style declaration](#styling-components) as its first argument,
and an object of configurable options as the second. The following options are supported.

* `styleName` (string) - The unique style name of the component. This name is primarily
  used in logging and caching. Defaults to the component name.
* `lockStyling` (boolean) - Will lock styles from being written after the default styles
  have been set. Defaults to `true`.
* `classNamesPropName` (string) - Name of the prop in which the compiled class names
  object is passed to. Defaults to `classNames`.
* `themePropName` (string) - Name of the prop in which the theme name is passed to.
  Defaults to `theme`.

An example of this in action.

```javascript
export default style({
  button: {
    // ...
  },
}, {
  styleName: 'CustomButton',
  lockStyling: false,
  classNamesPropName: 'classes',
  themePropName: 'appTheme',
})(Button);
```

### Styling Components

TODO

### Using Themes

TODO

### Unified Syntax

Aesthetic provides an optional unified CSS-in-JS syntax. This unified syntax permits
easy [drop-in replacements](https://en.wikipedia.org/wiki/Drop-in_replacement) between
adapters that utilize CSS-in-JS objects.

**Pros**
* Easily swap between CSS-in-JS adapters (for either performance or extensibility reasons)
  without having to rewrite all CSS object syntax.
* Only have to learn one form of syntax.

**Cons**
* Slight overhead (like milliseconds) converting the unified syntax to the adapters native
  syntax. However, Aesthetic caches heavily.
* Must learn a new form of syntax (hopefully the last one).

**Why a new syntax?**

While implementing adapters and writing tests for all their syntax and use cases, I noticed
that all adapters shared about 90-95% of the same syntax. That remaining percentage could
easily be abstracted away by a library, and hence, this unified syntax was created. In the end,
it was mostly for fun, but can easily be disabled if need be.

**Why a different at-rule structure?**

The major difference between the unified syntax and native adapters syntax, is that at-rules
in the unified syntax are now multi-dimensional objects indexed by the name of the at-rule
(`@media`), while at-rules in the native syntax are single objects indexed by the at-rule
declaration (`@media (min-width: 100px)`).

Supporting the native syntax incurred an linear (`O(n)`) lookup, as we would have to loop
through each object recursively to find all at-rules, while the unified syntax is a simple
constant (`O(1)`) lookup as we know the names ahead of time. This constant time lookup is
what enables a fast conversion process between the unified and native syntaxes.

**What if I want to use the adapter's syntax?**

If you'd like to use the native syntax of your chosen adapter, simply call
`disableUnifiedSyntax()` on the instance of your adapter.

#### Properties

Standard structure for defining properties.

* Supports camel case property names.
* Units can be written is literal numbers.

```javascript
button: {
  margin: 0,
  padding: 5,
  display: 'inline-block',
  lineHeight: 'normal',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#ccc',
  color: '#000',
},
buttonGroup: {
  // ...
},
```

> JSS requires the `jss-default-unit`, `jss-camel-case`, and `jss-nested`
> plugins for unified syntax support.

#### Pseudos

Pseudo elements and classes are defined inside an element as nested objects.

```javascript
button: {
  // ...
  ':hover': {
    backgroundColor: '#eee',
  },
  '::before': {
    content: '"★"',
    display: 'inline-block',
    marginRight: 5,
  },
},
```

#### Fallbacks

Property fallbacks for old browsers are defined under the `@fallbacks` object.
Each property accepts a single value or an array of values.

```javascript
wrapper: {
  // ...
  background: 'linear-gradient(...)',
  display: 'flex',
  '@fallbacks': {
    background: 'red',
    display: ['box', 'flex-box'],
  },
},
```

> Aphrodite does not support fallback styles.

#### Media Queries

Media queries are defined inside an element using a `@media` object.

```javascript
tooltip: {
  // ...
  maxWidth: 300,
  '@media': {
    '(min-width: 400px)': {
      maxWidth: 'auto',
    },
  },
},
```

#### Font Faces

Font faces are defined outside the element using a `@font-face` object
and are referenced by font family name.

```javascript
'@font-face': {
  roboto: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    src: "url('roboto.woff2') format('roboto')",
  },
},
button: {
  // ...
  fontFamily: 'Roboto',
},
tooltip: {
  // ...
  fontFamily: 'Roboto, sans-serif',
},
```

#### Animations

Animation keyframes are defined outside the element using a `@keyframes` object
and are referenced by animation name (the object key).

```javascript
'@keyframes': {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
},
button: {
  // ...
  animationName: 'fade',
  animationDuration: '3s',
},
```

#### Selectors

Parent, child, and sibling selectors are purposefully not supported. Use unique and
isolated element names and style declarations instead.

[css-modules]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-css-modules
[aphrodite]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-aphrodite
[glamor]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-glamor
[jss]: https://github.com/milesj/aesthetic/tree/master/packages/aesthetic-jss
