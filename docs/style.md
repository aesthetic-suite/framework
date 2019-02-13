# Styling Components

Now that [Aesthetic has been setup](./setup.md), we can style our components by wrapping the
component declaration in a [`withStyles` HOC](./setup.md#withStyles), which requires a function that
returns a CSS object known as a style sheet. When the styled component is rendered, the style sheet
is parsed and passed to the `styles` prop, which we can then use to dynamically generate CSS class
names at runtime.

```tsx
import React from 'react';
import withStyles, { WithStylesProps } from './withStyles';
import cx from './cx';

export type Props = {
  children: NonNullable<React.ReactNode>;
  icon?: React.ReactNode;
};

function Button({ children, styles, icon }: Props & WithStylesProps) {
  return (
    <button type="button" className={cx(styles.button)}>
      {icon && <span className={cx(styles.icon)}>{icon}</span>}

      {children}
    </button>
  );
}

export default withStyles(theme => ({
  button: {
    display: 'inline-block',
    padding: theme.unit,
    // ...
  },
  icon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: theme.unit,
  },
}))(Button);
```

## Defining Style Sheets

A style sheet is an object that maps selector names to 1 of 2 possible styling patterns, all of
which can be used in unison. The following styling patterns are available:

### Style Objects

A style object is a plain JavaScript object that defines CSS properties and styles according to the
[unified syntax specification](./unified). This is the standard approach for styling components.

```ts
withStyles(() => ({
  button: {
    display: 'inline-block',
    color: 'red',

    ':hover': {
      color: 'darkred',
    },
  },
  button__active: {
    color: 'darkred',
  },
}));
```

### Class Names

A class name is just that, a class name. This pattern can be used to reference CSS class names that
already exist in the document. This is a great pattern for third-party or reusable libraries.

```ts
withStyles(() => ({
  button: 'btn',
  button__active: 'btn--active',
}));
```

## Accessing Theme

Once a [theme has been registered](./theme.md), we can access the theme object with the 1st argument
in the style sheet function.

```ts
withStyles(theme => ({
  button: {
    fontSize: `${theme.fontSizes.normal}px`,
    fontFamily: theme.fontFamily,
    padding: theme.unit,
  },
}))(Component);
```

## Generating Class Names

When transforming styles into a CSS class name, the
[`transformStyles` function](./setup.md#transformStyles) (referred to as `cx` in the docs) must be
used. This function accepts an arbitrary number of arguments, all of which can be expressions,
values, or style objects that evaluate to a truthy value.

Furthermore, this function allows for inline styles to also be declared. These styles will be
compiled to an additional class name instead of relying on the `style` attribute.

<!-- prettier-ignore -->
```ts
import cx from './cx';

cx(
  styles.foo,
  expression && styles.bar,
  expression ? styles.baz : styles.qux,
  { marginTop: -16 },
);
```

Using our `Button` example above, let's add an active state and generate class names dynamically.
Specificity is important, so define styles and class names in order, from top to bottom!

```tsx
function Button({ children, styles, icon, active = false }: Props & WithStylesProps) {
  return (
    <button type="button" className={cx(styles.button, active && styles.button__active)}>
      {icon && <span className={cx(styles.icon)}>{icon}</span>}

      {children}
    </button>
  );
}
```

## Extending Styles

Since styles are isolated and co-located within a component, they can be impossible to customize,
especially if the component comes from a third-party library. If a component styled by Aesthetic is
marked as `extendable`, styles can be customized by calling the static `extendStyles` method on the
wrapped component instance.

Extending styles will return the original component wrapped with new styles, instead of wrapping the
styled component and stacking on an unnecessary layer.

```ts
import BaseButton from '../path/to/styled/Button';

export const TransparentButton = BaseButton.extendStyles(() => ({
  button: {
    background: 'transparent',
    // ...
  },
}));

export const PrimaryButton = BaseButton.extendStyles(theme => ({
  button: {
    background: theme.color.primary,
    // ...
  },
}));
```

> Parent styles (the component that was extended) are automatically merged with the new styles.

## Using Refs

Since Aesthetic uses an HOC approach, the underlying wrapped component is abstracted away. Sometimes
access to this wrapped component is required, and as such, a specialized ref can be used. When using
the `wrappedRef` prop, the wrapped component instance is returned.

```ts
let buttonInstance = null; // Button component

<StyledButton
  wrappedRef={ref => {
    buttonInstance = ref;
  }}
/>;
```
