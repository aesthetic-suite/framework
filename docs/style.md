# Styling Components

Now that [Aesthetic has been setup](./setup.md), we can style our components by wrapping the
component declaration in a [`withStyles` HOC](./setup.md#withStyles) or utilizing the
[`useStyles` hook](./setup.md#useStyles), both of which require a function that returns a CSS object
known as a style sheet. This style sheet can then be used to dynamically generate CSS class names at
runtime.

### HOC

When the styled and wrapped component is rendered, the style sheet is parsed and passed to the
`styles` prop. These styles can then be transformed to class names using our
[`cx` helper](./setup.md#transformStyles).

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

### Hook

When the component is rendered, the style sheet is parsed and returned from the hook alongside the
[`cx` helper](./setup.md#transformStyles), which is used for transforming the styles to class names.

```tsx
import React from 'react';
import useStyles from './useStyles';

export const styleSheet = theme => ({
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
});

export type Props = {
  children: NonNullable<React.ReactNode>;
  icon?: React.ReactNode;
};

export default function Button({ children, icon }: Props) {
  const [styles, cx] = useStyles(styleSheet);

  return (
    <button type="button" className={cx(styles.button)}>
      {icon && <span className={cx(styles.icon)}>{icon}</span>}

      {children}
    </button>
  );
}
```

## Defining Style Sheets

A style sheet is an object that maps selector names to 1 of 3 possible styling patterns, all of
which can be used in unison. The following styling patterns are available:

### Style Objects

A style object is a plain JavaScript object that defines CSS properties and styles according to the
[unified syntax specification](./unified). This is the standard approach for styling components.

```ts
theme => ({
  button: {
    padding: theme.unit,
    display: 'inline-block',
    color: 'red',

    ':hover': {
      color: 'darkred',
    },
  },
  button__active: {
    color: 'darkred',
  },
});
```

### CSS Declarations

If you prefer to write standard CSS instead of JS objects, you can do just that by passing a string
to each selector. This functionality is powered by [Stylis](https://github.com/thysultan/stylis.js).

This pattern requires explicit values, for example, defining "px" instead of relying on automatic
unit insertion. To reference the current class name, use `&` as an insertion point.

```ts
theme => ({
  button: `
    padding: ${theme.unit}px;
    display: inline-block;
    color: red;

    &:hover {
      color: darkred;
    }
  `,
  button__active: `
    color: darkred;
  `,
});
```

> Type safety is lost, unified syntax is ignored, and chosen adapter is bypassed when using this
> approach.

### Class Names

A class name is just that, a class name. This pattern can be used to reference CSS class names that
already exist in the document. This is a great pattern for third-party or reusable libraries.

```ts
() => ({
  button: 'btn',
  button__active: 'btn--active',
});
```

## Accessing Theme

Once a [theme has been registered](./theme.md), we can access the theme object with the 1st argument
in the style sheet function.

```ts
theme => ({
  button: {
    fontSize: `${theme.fontSizes.normal}px`,
    fontFamily: theme.fontFamily,
    padding: theme.unit,
  },
});
```

## Generating Class Names

When transforming styles into a CSS class name, the
[`transformStyles` function](./setup.md#transformStyles) (referred to as `cx` in the docs) must be
used. This function accepts an arbitrary number of arguments, all of which can be expressions,
values, or style objects that evaluate to a truthy value.

Furthermore, this function allows for inline styles and external class names to also be declared.
These styles will be compiled to an additional class name instead of relying on the `style`
attribute.

```ts
cx(
  styles.foo,
  expression && styles.bar,
  expression ? styles.baz : styles.qux,
  { marginTop: -16 },
  'global-class-name',
);
```

Using our hook powered `Button` example above, let's add an active state and generate class names
dynamically. Specificity is important, so define styles and class names in order, from top to
bottom!

```tsx
function Button({ children, icon, active = false }: Props) {
  const [styles, cx] = useStyles(styleSheet);

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
especially if the component comes from a third-party library. Aesthetic supports 2 forms of style
extending based on the API you choose to use.

### Composing Style Sheets

The `Aesthetic#extendStyles` method can be used to compose multiple style sheet providing functions
into a single style sheet function.

```ts
import aesthetic from './aesthetic';
import { styleSheet } from './path/to/Component';

const styleSheet = aesthetic.extendStyles(
  () => ({
    button: {
      background: 'transparent',
      // ...
    },
  }),
  // Another style sheet function
  theme => ({
    button: {
      background: theme.color.primary,
      // ...
    },
  }),
  // An imported style sheet function
  styleSheet,
);
```

### From A Component

If a component is styled by `Aesthetic#withStyles` and marked as `extendable`, styles can be
customized by calling the static `extendStyles` method on the wrapped component instance.

```ts
import BaseButton from './path/to/Button';

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

> Extending styles will return the original component wrapped with new styles, instead of wrapping
> the styled component and stacking on an unnecessary layer.

## Using Refs

When using `withStyles`, the underlying wrapped component is abstracted away. Sometimes access to
this wrapped component is required, and as such, a specialized ref can be used. When using the
`wrappedRef` prop, the wrapped component instance is returned.

```tsx
let buttonInstance = null; // Button component

<StyledButton
  wrappedRef={ref => {
    buttonInstance = ref;
  }}
/>;
```
