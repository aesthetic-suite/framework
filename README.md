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

## Adapters

Only adapters that score a star in all categories are supported: https://github.com/MicheleBertoli/css-in-js

### CSS Classes

```javascript
style({
  foo: 'foo',
  bar: 'bar',
})(Component);
```

### CSS Modules

```css
.foo {
  color: 'red';
  display: 'inline';
}
.bar {
  color: 'blue';
  padding: 5px;
}
```

```javascript
import styles from './styles.css';

style(styles)(Component);
```

### Aphrodite, JSS, Glamor, Fela, VStyle, Styletron, Babel CSS-In-JS

```javascript
style({
  foo: {
    color: 'red',
    display: 'inline',
  },
  bar: {
    color: 'blue',
    padding: 5,
  },
})(Component);
```

### Unsupported Adapters

* **CSSX** - Does not generate unique class names during compilation and instead
  uses the literal class names and or tag names defined in the style declaration.
  This allows for global style collisions, which we want to avoid.
* **Radium** - Uses inline styles instead of compiling and attaching CSS styles
  to the DOM.

## Themes

TODO

## Unified CSS-in-JS Syntax

Aesthetic provides a unified CSS-in-JS syntax for all adapters, which enables
easy [drop-in replacements](https://en.wikipedia.org/wiki/Drop-in_replacement)
between adapters and functionality.

However, this unified syntax does add an extra bit of overhead. If you'd like to use
the native syntax of your chosen adapter, simply call `disableUnifiedSyntax()` on
the instance of your adapter.

> JSS requires the `jss-default-unit`, `jss-camel-case`, and `jss-nested` plugins.

### Declarations

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
}
```

### Pseudos

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
}
```

### Fallbacks

Fallbacks for old browsers are defined under the `@fallbacks` object.
Each property accepts a single value or an array of values.

```javascript
element: {
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

### Media Queries

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
}
```

### Font Faces

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

### Animations

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

### Selectors

Parent, child, and sibling selectors are purposefully not supported. Use unique element
names and style declarations instead.
