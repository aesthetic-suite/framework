# Style sheets

Styles within Aesthetic are managed through style sheets and are divided into the following 2
categories.

- [Component style sheets](./style-sheets/components.md). Isolates styles to components and their
  elements.
- [Theme style sheets](./style-sheets/themes.md). Provides styles and at-rules for the document.

Style sheets are created with either the `createComponentStyles()` or `createThemeStyles()` methods
respectively. Both methods require a function that returns a _style object_ (also known as a factory
function).

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
}));
```

## Utilities

Manually writing style objects over and over can be tiresome, especially when you need to reuse
consistent values (font sizes, spacing, etc) across many components. Aesthetic solves this through
its robust [design system](../design/about.md), which is a _hard requirement_ as it powers all
reusability. To make use of this, the design system must be compiled into JavaScript/TypeScript
based [design tokens](../tokens/about.md).

A few design token based utility methods are passed to the 1st argument within the style sheet
factory function. We like to name this object `css`, as demonstrated within the examples below.

### Variables

Variables are consistent and reusable values that are derived from settings within a design system's
language and themes. A variable can be accessed with the `var(name: string)` method, which requires
a fully qualified name based on the token object structure.

Let's now update our example to _not_ use hard-coded padding values, while also using expanded
properties.

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
}));
```

> Mixins are very experimental. Feedback is greatly appreciated!

- [List of valid mixin names](https://github.com/aesthetic-suite/framework/blob/master/packages/system/src/types.ts#L494)
- [Built-in mixins and their CSS properties](https://github.com/aesthetic-suite/framework/tree/master/packages/system/src/mixins)
- Customizing mixins _(coming soon)_

### Units

If you ever need a `rem` unit based on the design system's spacing type, use the
`unit(...sizes: number[])` method, which requires any number of multipliers.

Let's say our root text size is 16px and our spacing unit is 8px, we would generate the following
`rem` values.

```ts
const styleSheet = createComponentStyles((css) => ({
  button: {
    // All edges
    padding: css.unit(1), // .5rem
    // Top/bottom, left/right
    padding: css.unit(1, 2), // .5rem 1rem
    // Top, right, bottom, left
    padding: css.unit(1, 2, 3, 4), // .5rem 1rem 1.5 2rem
    // ...
  },
}));
```

> Using explicit units is frowned upon as it deviates from the design system's strict spacing
> guidelines. It also increases the CSS output size as it generates additional class names. Use
> sparingly.
