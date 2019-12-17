# Styling Components

We can start style our components using a concept known as a style sheet factory. A style sheet
factory is a function that returns an object which maps selectors to a defined
[style pattern](#style-patterns) (the style sheet object).

## Working With Style Sheets

There are 3 phases involved when working with style sheets. As a preface, when integrating with a
framework (like React), this process is entirely abstracted away, but the core concepts are nice to
know.

The first phase is registering and persisting the actual style sheet with
`Aesthetic#registerStyleSheet`. This method requires a style sheet factory function and returns a
unique ID (known as a style name) that must be used in subsequent calls.

```ts
const styleName = aesthetic.registerStyleSheet(theme => ({
  button: {
    padding: theme.unit,
  },
}));
```

Once the style sheet is registered, the second phase will execute the function and parse the result
using the underlying adapter (like Aphrodite). This is triggered by the `Adapter#createStyleSheet`
method, which requires the unique style name from the previous example, and returns a cached and
parsed style sheet. This parsed style sheet is then used to generate
[CSS class names](#generating-class-names).

```ts
const adapter = aesthetic.getAdapter();

// Current settings
const styles = adapter.createStyleSheet(styleName);

// To enable RTL
const styles = adapter.createStyleSheet(styleName, { dir: 'rtl' });

// To change themes
const styles = adapter.createStyleSheet(styleName, { theme: 'dark' });
```

And lastly, we must inject the generated native CSS style sheet into the DOM using
`Adapter#flushStyles`. This also requires a unique style name.

```ts
adapter.flushStyles(styleName);
```

### Style Patterns

The following 3 styling patterns are available, all of which can be used in unison.

#### CSS Objects

A CSS object is a plain JavaScript object that defines CSS properties and styles according to the
[unified syntax specification](./unified). This is the standard approach for styling components.

```ts
const factory = theme => ({
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
const factory = theme => ({
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
const factory = () => ({
  button: 'btn',
  button__active: 'btn--active',
});
```

## Accessing The Theme

Once a [theme has been registered](./theme.md), we can access the theme object with the 1st argument
in the style sheet function.

```ts
const factory = theme => ({
  button: {
    fontSize: `${theme.fontSizes.normal}px`,
    fontFamily: theme.fontFamily,
    padding: theme.unit,
  },
});
```

## Generating Class Names

When transforming styles into a CSS class name, the `cx` function must be used (framework
integration dependent), which is a wrapper around `Adapter#transformStyles`. This function accepts
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

## Purging Flushed Styles

In some rare cases, it may be required to purge and remove all styles that Aesthetic has flushed
into the document. This functionality is achieved with `Aesthetic#purgeStyles` and is what powers
dynamic and immediate theme switching.

```ts
adapter.purgeStyles();

// Or for a single style
adapter.purgeStyles(styleName);
```

## Extending Styles

To extend styles, the style sheet factory must be defined outside of a component, and easily
importable. Once done, the `Aesthetic#extendStyles` method can be used to compose multiple style
sheet providing functions into a single style sheet function.

```ts
import aesthetic from 'aesthetic';
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

> Factories are processed left to right, with the next overriding the previous.
