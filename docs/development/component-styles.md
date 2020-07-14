# Component style sheets

Components and their tree are styled through Aesthetic specific style sheets, which are created with
the `createComponentStyles()` method. This method operates on a function that factories a mapping of
selectors to style objects.

For the purpose of this documentation, let's say we're building a button component that renders many
elements and componenets, we would have a style sheet that looks something like the following.

<!-- prettier-ignore -->
```ts
import { createComponentStyles } from '@aesthetic/core';

const styleSheet = createComponentStyles(() => ({
  button: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 'inherit',
    margin: 0,
    padding: '6px 8px',
    textAlign: 'center',
    textDecoration: 'none',
    userSelect: 'auto',
    verticalAlign: 'middle',
  },
  button_selected: { /* ... */ },
  button_disabled: { /* ... */ },
  button_asBlock: { /* ... */ },
  beforeIcon: { /* ... */ },
  afterIcon: { /* ... */ },
}));
```

In the example above, the keys of the object are known as selectors, with each selector being a
combination of element and optional modifier (separated by an underscore). This is similar to the
popular [BEM syntax](http://getbem.com/naming/), without the block, as our style sheet is the block
(since styles are scoped implicitly). Style sheets support as many selectors as needed!

> In the example above we import from `@aesthetic/core`. This should be replaced with your
> integration of choice, for example if using React, import from `@aesthetic/react`.

## Using tokens

Manually writing style objects over and over can be tiresome, especially when you need to reuse
consistent values (font sizes, spacing, etc) across many components. Aesthetic solves this through
its robust [design system](../design/about.md), which is a _hard requirement_ as it powers all
reusability. To make use of this, the design system must be compiled into JavaScript/TypeScript
based [design tokens](../tokens/about.md).

What's a token you ask? In Aesthetic speak, a token is either a variable or a mixin. Both of which,
and more utility, is available on the theme object passed to the factory function (we like to name
our argument `css`).

### Variables

Variables are consistent and reusable values that are derived from settings within a design system's
language and themes. A variable can be accessed with the `var(name: string)` method, which requires
a fully qualified name based on the token object structure.

Let's now update our example to _not_ use hard-coded padding values.

```ts
const styleSheet = createComponentStyles((css) => ({
  button: {
    appearance: 'none',
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: 'inherit',
    margin: 0,
    padding: {
      topBottom: css.var('spacing-df'), // Default padding
      leftRight: css.var('spacing-md'), // Medium padding
    },
    textAlign: 'center',
    textDecoration: 'none',
    userSelect: 'auto',
    verticalAlign: 'middle',
  },

  /* ... */
}));
```

> Variables utilize CSS variables under the hood for dynamic styling and reduced output size.

- [List of valid variable names](https://github.com/aesthetic-suite/framework/blob/master/packages/system/src/types.ts#L442)

### Mixins

Mixins also provide reusability, but instead of providing a single value, they provide a collection
of pre-styled CSS properties that can be merged into your own style objects via the
`mixin(name: string, styles: object)` method. The list of properties are hard-coded in Aesthetic but
can be customized through the design system package.

Continuing our example even further, let's easily reset our button. You'll notice that we removed
most of the properties. That's because they are provided by the mixin and we no longer have to
define them manually!

```ts
const styleSheet = createComponentStyles((css) => ({
  button: css.mixin('pattern-reset-button', {
    padding: {
      topBottom: css.var('spacing-df'),
      leftRight: css.var('spacing-md'),
    },
    textAlign: 'center',
  }),

  /* ... */
}));
```

- [List of valid mixin names](https://github.com/aesthetic-suite/framework/blob/master/packages/system/src/types.ts#L494)
- [Built-in mixins and their CSS properties](https://github.com/aesthetic-suite/framework/tree/master/packages/system/src/mixins)
- Customizing mixins _(coming soon)_

### Units

## Styling elements

### Selectors

### Media and feature queries

### Font faces

### Keyframes

### Fallbacks

## Adding variants

### By color scheme

### By contrast level

### By theme

## Rendering CSS

- Talk about hooks/cx.
