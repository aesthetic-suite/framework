# Styling Components

As mentioned previously, to style a component, an object or function must be passed as the 1st
argument to the [styler function](./setup.md). This object represents a mapping of selectors (and
modifiers) to declarations. For example:

```javascript
withStyles({
  button: { ... },
  button__active: { ... },
  icon: { ... },
})(Button)
```

The following types of declarations are permitted.

## External Classes

External CSS class names can be referenced by passing a string of the class name.

```javascript
withStyles({
  button: 'button',
  button__active: 'button--active',
  icon: 'button__icon',
})(Button);
```

> To only make use of class names, the provided `ClassNameAdapter` must be used.

## Style Objects

CSS styles can be defined using an object of properties to values. These objects are transformed
using [adapters](./adapters) and optionally support the [unified syntax](./unified) defined by
Aesthetic.

```javascript
withStyles({
  button: {
    background: '#eee',
    // ...
  },
  button__active: {
    background: '#fff',
    // ...
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    // ...
  },
})(Button);
```

## Style Functions

Style functions are simply functions that return a style object. The benefits of using a function is
that it provides the [current theme](./theme.md#using-themes) as the 1st argument, and the current
React component props as the 2nd argument.

```javascript
withStyles((theme, props) => {
  // ...
})(Button);
```
