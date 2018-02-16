# Defining Components

Now that we have a styler function, we can start styling our components by wrapping
the component declaration with the styler function and passing an object of styles.
When this component is rendered, the style sheet is passed to the `styles` prop,
and we can generate a class name using the `transform` function (`classes` in the example).

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { StylesPropType } from 'aesthetic';
import withStyles, { classes } from '../path/to/styler';

function Button({ children, styles, icon }) {
  return (
    <button type="button" className={classes(styles.button)}>
      {icon && (
        <span className={classes(styles.icon)}>{icon}</span>
      )}

      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  styles: StylesPropType.isRequired,
  icon: PropTypes.node,
};

export default withStyles({
  button: { ... },
  icon: { ... }
})(Button);
```

## Customizing Styles

Since styles are isolated and co-located within a component, they can be impossible to
customize, especially if the component comes from a third-party library. If a component
styled by Aesthetic is marked as `extendable`, styles can be customized by calling
the static `extendStyles` method on the wrapped component instance.

> Extending styles will return the original component wrapped with new styles,
> instead of wrapping the styled component and stacking on an unnecessary layer.

```javascript
import BaseButton from '../path/to/styled/Button';

export const Button = BaseButton.extendStyles({
  button: {
    background: 'white',
    // ...
  },
});

export const PrimaryButton = BaseButton.extendStyles({
  button: {
    background: 'blue',
    // ...
  },
});
```

Parent styles (the component that was extended) are automatically merged with the new styles.

## Using Classes

When applying or combining class names to a component, the `transform` function provided by
`createStyler` must be used. This function accepts an arbitrary number of arguments, all of
which can be strings or style objects that evaluate to truthy.

```javascript
import withStyles, { classes } from '../path/to/styler';

classes(
  styles.foo,
  expression && styles.bar,
  expression ? styles.baz : styles.qux,
);
```

Using our `Button` examples above, let's add an active state and combine classes like so.
Specificity is important, so define styles from top to bottom!

```javascript
function Button({ children, styles, icon, active = false }) {
  return (
    <button
      type="button"
      className={classes(
        styles.button,
        active && styles.button__active,
      )}
    >
      {icon && (
        <span className={classes(styles.icon)}>{icon}</span>
      )}

      {children}
    </button>
  );
}
```
