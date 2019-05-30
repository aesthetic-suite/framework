# Styling Components

Now that [Aesthetic has been setup](./setup.md), we can start styling our components using a concept
known as a style sheet. A style sheet is a function that returns an object which maps selectors to a
defined [style pattern](#style-patterns).

## Working With Style Sheets

There are 3 phases involved when working with style sheets. As a preface, when integrating with a
framework (like React), this process is entirely abstracted away, but the core concepts are nice to
know.

The first phase is defining and persisting the actual style sheet with `Aesthetic#setStyleSheet`.
This method requires a unique style name as the 1st argument (this is used as a cache key) and the
style sheet function as the 2nd argument.

```ts
aesthetic.setStyleSheet('button-component', theme => ({
  button: {
    padding: theme.unit,
  },
}));
```

Once the style sheet is defined, the second phase will parse and process it using the underlying
adapter (like Aphrodite). This is triggered by the `Aesthetic#createStyleSheet` method, which
requires the unique style name from the previous example, and returns a cached and parsed style
sheet. This parsed style sheet is then used to generate [CSS class names](#generating-class-names).

```ts
const styles = aesthetic.createStyleSheet('button-component');

// To support RTL
const styles = aesthetic.createStyleSheet('button-component', { rtl: true });
```

And lastly, we must inject the generated native CSS style sheet into the DOM using
`Aesthetic#flushStyles`. This also requires a unique style name.

```ts
aesthetic.flushStyles('button-component');
```

### Style Patterns

The following 3 styling patterns are available, all of which can be used in unison.

#### CSS Objects

A CSS object is a plain JavaScript object that defines CSS properties and styles according to the
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

#### CSS Declarations

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

#### Class Names

A class name is just that, a class name. This pattern can be used to reference CSS class names that
already exist in the document. This is a great pattern for third-party or reusable libraries.

```ts
() => ({
  button: 'btn',
  button__active: 'btn--active',
});
```

## Accessing The Theme

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

When transforming styles into a CSS class name, the `cx` function must be used (framework
integration dependent), which is a wrapper around `Aesthetic#transformStyles`. This function accepts
an arbitrary number of arguments, all of which can be expressions, values, or style objects that
evaluate to a truthy value.

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
  // Base style sheet function
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

### From A React Component

If a component is styled with `withStyles` and marked as `extendable`, styles can be customized by
calling the static `extendStyles` method on the wrapped component instance.

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
