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
`animationName` property, which accepts a single _keyframes object_.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    // ...
    animationName: {
      from: { transform: 'scaleX(0)' },
      to: { transform: 'scaleX(1)' },
    },
    animationDuration: '3s',
    animationTimingFunction: 'ease-in',
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

### Variants

Variants are a staple feature of many components -- especially commonly used ones like buttons,
alerts, and labels -- and encompasses everything from sizing (small, large) to palettes (success,
failure, etc).

With that being said, the guiding principle behind variants is that _only 1_ may ever be active at a
time. If you need to apply more than 1, then you should use the element-modifier syntax mentioned at
the beginning of the chapter.

To utilize variants, we define a `@variants` object on a per element basis that maps each variant
name to a _style object_ (that'll be applied when activated). Variant names are critically important
and must be written in a format of `<type>_<variant>`, as demonstrated below.

```ts
const styleSheet = createComponentStyles((css) => ({
  button: {
    // ...

    '@variants': {
      size_sm: { fontSize: 14 },
      size_df: { fontSize: 16 },
      size_lg: { fontSize: 18 },

      palette_brand: { backgroundColor: css.var('palette-brand-bg-base') },
      palette_success: { backgroundColor: css.var('palette-success-bg-base') },
      palette_warning: { backgroundColor: css.var('palette-warning-bg-base') },
    },
  },

  // ...
}));
```

How a variant gets activated is highly dependent on the integration you are using, but it basically
boils down to the following class name generation.

```ts
const className = cx('button', { size: 'sm', palette: 'brand' });
```

#### Handling defaults

When handling default styles for a variant, you _must_ define it as a variant instead of defining it
on the element directly. This is necessary as it avoids style collisions and specificity issues.

```ts
// Correct
const styleSheet = createComponentStyles((css) => ({
  button: {
    '@variants': {
      size_sm: { fontSize: 14 },
      size_df: { fontSize: 16 },
      size_lg: { fontSize: 18 },
    },
  },
}));

// INCORRECT
const styleSheet = createComponentStyles((css) => ({
  button: {
    fontSize: 16,

    '@variants': {
      size_sm: { fontSize: 14 },
      size_lg: { fontSize: 18 },
    },
  },
}));
```

## Adding variants

While we support variants per [element](#variants), we also support variants on the style sheet.
When defined at this level, any variants deemed active will be deeply merged into a single style
sheet in the order of: base < color scheme < contrast level < theme.

Style sheet variants will override any selector, element, element at-rule (even their variants), or
nested style object from the base style sheet! This makes it very powerful and very robust.

### By color scheme

Use the `addColorSchemeVariant()` method for variants depending on the "light" or "dark" color
scheme of the currently active theme. This is perfect for making slight changes to a theme between
the two modes.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'gray',
  },
}))
  .addColorSchemeVariant('light', () => ({
    element: {
      backgroundColor: 'white',
      color: 'black',
    },
  }))
  .addColorSchemeVariant('dark', () => ({
    element: {
      backgroundColor: 'black',
      color: 'white',
    },
  }));
```

This is equivalent to the native `prefers-color-scheme` media query.

```html
<link href="themes/default.css" rel="stylesheet" />
<link href="themes/day.css" rel="stylesheet" media="screen and (prefers-color-scheme: light)" />
<link href="themes/night.css" rel="stylesheet" media="screen and (prefers-color-scheme: dark)" />
```

### By contrast level

Use the `addContrastVariant()` method for variants depending on the "low" or "high" contrast level
of the currently active theme. This is perfect for providing accessible themes.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'orange',
  },
}))
  .addContrastVariant('low', () => ({
    element: {
      color: 'red',
    },
  }))
  .addContrastVariant('high', () => ({
    element: {
      color: 'yellow',
    },
  }));
```

This is equivalent to the native `prefers-contrast` media query.

```html
<link href="themes/default.css" rel="stylesheet" />
<link href="themes/default-low.css" rel="stylesheet" media="screen and (prefers-contrast: low)" />
<link href="themes/default-high.css" rel="stylesheet" media="screen and (prefers-contrast: high)" />
```

### By theme

And finally, use the `addThemeVariant()` method for variants depending on the currently active theme
itself. This provides granular styles on a theme-by-theme basis, perfect for style sheets that are
provided by third-parties.

```ts
const styleSheet = createComponentStyles(() => ({
  element: {
    display: 'block',
    color: 'gray',
  },
}))
  .addThemeVariant('night', () => ({
    element: {
      color: 'blue',
    },
  }))
  .addThemeVariant('twilight', () => ({
    element: {
      color: 'purple',
    },
  }));
```

> Theme names must match the names passed to `registerTheme()` or `registerDefaultTheme()`.

## Rendering CSS

Rendering a style sheet into CSS and injecting into the document is typically handled by an
integration and abstracted away from the consumer (see `useStyles()` in the React package). However,
if you would like to render styles manually, you may do so with the `renderComponentStyles()`
method.

This method requires the style sheet instance as the 1st argument, an optional object of
customizable options as the 2nd argument, and returns an object of class names mapped to their
selector.

```ts
import { renderComponentStyles } from '@aesthetic/core';
import styleSheet from './some/styleSheet';

const classNames = renderComponentStyles(styleSheet, {
  direction: 'rtl',
  vendor: true,
});
```

The following options are supported:

- `contrast` (`low | high`) - Contrast level variant to activate.
- `direction` (`ltr | rtl`) - Directionality of properties and their values.
- `scheme` (`light | dark`) - Color scheme variant to activate.
- `theme` (`string`) - Theme instance to pass to style sheets. Defaults to the active theme.
- `unit` (`string | (prop: string) => string`) - Default unit suffix. Defaults to `defaultUnit`
  option.
- `vendor` (`boolean`) - Apply vendor prefixes. Defaults to `vendorPrefixes`.