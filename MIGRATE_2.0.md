# 2.0.0 Migration

Aesthetic has been rewritten to properly support specificity and new at-rules. To support
these new patterns, please migrate the following.

> Other changes outside of this document may be required.

### New `createStyler` return functions

The `createStyler` function now returns an object with 2 functions, `style` and `transform`.
The `style` function acts like the v1 implementation, while `transform` is now used for
generating classes dynamically from style declarations.

```javascript
// Old
export default createStyler(new Aesthetic(new JSSAdapter()));

// New
const { style, transform } = createStyler(new Aesthetic(new JSSAdapter()));

export const classes = transform;
export default style;
```

The new `transform` function replaces the old `classes` utility function.

### Render styles instead of class names

Styles are no longer transformed on mount and instead are transformed during a render cycle.
This change was made to properly support specificity. Because of this, class names (the
`classNames` prop) are no longer passed to a component. Instead, style declarations are passed
under the `styles` prop, all of which need to be passed to the new `transform` function.

```javascript
// Old
import React, { PropTypes } from 'react';
import { classes, ClassNamesPropType } from 'aesthetic';
import withStyles from '../path/to/styler';

function Button({ active, children, classNames, icon }) {
  return (
    <button
      type="button"
      className={classes(
        classNames.button,
        active && classNames.button__active,
      )}
    >
      {icon && (
        <span className={classNames.icon}>{icon}</span>
      )}

      {children}
    </button>
  );
}

Button.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  classNames: ClassNamesPropType.isRequired,
  icon: PropTypes.node,
};

export default withStyles({
  button: { ... },
  button__active: { ... },
  icon: { ... }
})(Button);

// New
import React, { PropTypes } from 'react';
import { StylesPropType } from 'aesthetic';
import withStyles, { classes } from '../path/to/styler';

function Button({ active, children, styles, icon }) {
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

Button.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  styles: StylesPropType.isRequired,
  icon: PropTypes.node,
};

export default withStyles({
  button: { ... },
  button__active: { ... },
  icon: { ... }
})(Button);
```

> The `transform` function should always be used when setting a `className` value.

### Theme prop changes

Previously, the current theme name was passed as a `theme` prop to all styled components.
Now, the theme name is passed as a `themeName` prop and the current theme declarations are
passed under the `theme` prop. This also applies to changing a theme.

```javascript
// Old
<Button theme="dark">Save</Button>

// New
<Button themeName="dark">Save</Button>
```

### Font face source paths (unified syntax)

To properly and easily support font faces and their variations, each declaration new requires
a `srcPaths` property, which is an array of paths. Each font family now accepts an array of font
face declarations.

Also, the `fontFamily` property is now optional.

```javascript
// Old
'@font-face': {
  Roboto: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    src: "local('Robo'), url('fonts/Roboto.woff2') format('woff2'), url('fonts/Roboto.ttf') format('truetype')",
  },
}

// New
'@font-face': {
  Roboto: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    srcPaths: ['fonts/Roboto.woff2', 'fonts/Roboto.ttf'],
  },
}
```
