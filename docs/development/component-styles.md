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
    display: 'inline-flex',
    padding: '6px 8px',
    textAlign: 'center',
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
specific values (font sizes, spacing, etc) across many components. Aesthetic solves this through its
robust [design system](../design/about.md), which is a hard requirement as it powers all
reusability. To make use of this, the design system must be compiled into JavaScript/TypeScript
based [design tokens](../tokens/about.md).

What's a token you ask? In Aesthetic speak, a token is either a variable or a mixin. Both of which,
and more utility, is available on the theme object passed to the factory function (we like to name
our argument `css`).

### Variables

### Mixins

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
