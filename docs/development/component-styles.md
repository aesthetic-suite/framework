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

  // ...
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

  // ...
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

  // ...
}));
```

> Using explicit units is frowned upon as it deviates from the design system's strict spacing
> guidelines. It also increases the CSS output size as it generates additional class names. Use
> sparingly.

## Styling elements

Now that you know how to create style sheets and utilize tokens, let's talk about styles. Styles are
written using plain JavaScript objects and are aptly named _style objects_.

The structure of a style object is based on the `LocalBlock` type provided by the
[@aesthetic/sss](../packages/sss/README.md) package. The SSS documentation has in-depth examples,
but for convenience, we'll also provide some examples below.

### Selectors

There are 2 types of selectors, the first being _basic selectors_, which includes pseudo elements,
pseudo classes, and HTML attributes that are deterministic and **do not** have permutations. They
can be defined as nested style objects directly on the element's style object.

```ts
const styleSheet = createComponentStyles((css) => ({
  button: {
    backgroundColor: css.var('palette-brand-bg-base'),
    // ...

    ':hover': {
      backgroundColor: css.var('palette-brand-bg-hovered'),
    },

    '[disabled]': {
      backgroundColor: css.var('palette-brand-bg-disabled'),
      opacity: 0.75,
    },
  },

  // ...
}));
```

The other type is _advanced selectors_, which includes
[combinators](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators), as well
as pseudos and attributes that **do** have permutations. Furthermore, multiple selectors can be
defined at once using a comma separated list.

Advanced selectors must be nested within a `@selectors` object as they can not be properly typed
with TypeScript.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    // ...

    '@selectors': {
      // Combinators must start with >, ~, or +
      '> li': {
        listStyle: 'none',
      },

      // Attributes must start with [ and end with ]
      '[href*="foo"]': {
        color: 'red',
      },

      // Pseudos must start with : or ::
      ':not(:nth-child(9))': {
        display: 'hidden',
      },

      // Multiple selectors can be separated with a comma
      ':disabled, [disabled]': {
        opacity: 0.75,
      },
    },
  },
}));
```

### Media and feature queries

Media and feature queries can be defined within a style object using `@media` and `@supports`
respectively. Both types require an object that maps query expressions to nested style objects.

```ts
const styleSheet = createComponentStyles(() => ({
  button: {
    display: 'inline-block',
    // ...

    '@media': {
      '(max-width: 600px)': {
        width: '100%',
      },
    },

    '@supports': {
      '(display: inline-flex)': {
        display: 'inline-flex',
      },
    },
  },

  // ...
}));
```

> Both `@media` and `@supports` may be nested within itself and each other.

### Font faces

Fonts are special as they need to be defined on the document instead of an element, which should be
done with a [theme style sheet](./theme-styles.md). However, we provide some convenience through the
`fontFamily` property, which can accept one or many _font face objects_.

Unlike normal CSS font faces, a _font face object_ requires a `srcPath` property, with a list of
file paths, instead of a `src` property.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    // ...
    fontFamily: {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  },
}));
```

### Keyframes

Animations have the same semantics as fonts and should be defined on a document using a
[theme style sheet](./theme-styles.md), but also like fonts, we provide some convenience through the
`animationName` property, which can accept one or many _keyframes objects_.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    // ...
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
}));
```

### Fallbacks

A rarely used but necessary feature for progressive enhancement and supporting legacy browsers.
Fallbacks allow you to define one or many different values for a single property through the
`@fallbacks` object.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    // ...
    display: 'inline-flex',

    '@fallbacks': {
      display: ['inline', 'inline-block'],
    },
  },
}));
```

## Adding variants

### By color scheme

### By contrast level

### By theme

## Rendering CSS

- Talk about hooks/cx.
