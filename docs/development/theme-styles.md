# Theme style sheets

While [component style sheets](./component-styles.md) are used to style elements in isolation, a
theme style sheet is used to style the document (or a container), while also providing global
at-rules like font faces or keyframes.

Use the `createThemeStyles()` method to create a theme style sheet. Once ready for production, the
style sheet can be passed on a theme-by-theme basis during registration with `registerTheme()` or
`registerDefaultTheme()`. Feel free to add a style sheet to one or many themes.

```ts
import { createThemeStyles, registerTheme } from '@aesthetic/core';
import dayTheme from './themes/day';
import nightTheme from './themes/night';

const styleSheet = createThemeStyles(() => ({
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  },
}));

registerTheme('day', dayTheme, styleSheet);
registerTheme('night', nightTheme, styleSheet);
```

## Using tokens

Themes style sheets can also use design tokens provided by an upstream design system. For more
information on how to use design tokens, jump to the
[component style sheet documentation](./component-styles.md#using-tokens).

```ts
const styleSheet = createThemeStyles((css) => ({
  '@root': css.mixin('root', {
    color: css.var('palette-neutral-fg-base'),
  }),
}));
```

## Styling themes

Theme style sheets primarily define global at-rules and container styles with _style objects_.

### Root containers

A container is used to provide "global" styles (fonts, colors, etc) to a specific portion of a
component/element tree by acting as the root. Styles are scoped to a class name to avoid collisions,
so they're not truely global, but are applied in 1 of 2 ways:

- Document wide through the `<body>` element. Automatically applied when activating a theme.
- Per element through a `<div>` element. Manually applied when using nested/contextual themes.

Container styles can be defined with the `@root` at-rule, which accepts standard style objects (as
if you're styling a component). It pairs well with the `root` mixin.

```ts
const styleSheet = createThemeStyles((css) => ({
  '@root': css.mixin('root', {
    backgroundColor: css.var('palette-neutral-bg-base'),
    color: css.var('palette-neutral-fg-base'),
    height: '100%',

    '@selectors': {
      a: {
        color: css.var('palette-brand-fg-base'),
      },
    },
  }),
}));
```

> The `html`, `:root`, or `*` global styles cannot be defined with `@root`. Those category of
> globals should be handled outside of this system.

### Font faces

Defines a [font face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) that can be
referenced with the `fontFamily` property. The at-rule requires an object, with the font family name
as the key, and the font face(s) as the value. Each font face requires a `srcPaths` array.

To support multiple font variations, like bold and italics, pass an array of font faces.

```ts
const styleSheet = createThemeStyles(() => ({
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
    Roboto: {
      // ....
    },
  },
}));
```

Font faces defined within a theme style sheet can be accessed within a component style sheet by
referencing their name, like so.

```ts
const styleSheet = createComponentStyles((css) => ({
  element: {
    // Explicitly
    fontFamily: '"Open Sans", Roboto, sans-serif',
    // Configured in the design system (preferred)
    fontFamily: css.var('typography-font-text'),
  },
}));
```

> Do note that font family names must be globally unique to avoid collisions.

### Keyframes

Defines a [keyframes animation](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) that
can be referenced with the `animationName` property. The at-rule requires an object, with the
animation name as the key, and the keyframes as the value. Supports both range (from/to) and
percentage based sequences.

```ts
const styleSheet = createThemeStyles(() => ({
  '@keyframes': {
    // Range
    fade: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },

    // Percentage
    slide: {
      '0%': { left: '0%' },
      '50%': { left: '75%' },
      '100%': { left: '100%' },
    },
  },
}));
```

Keyframes defined within a theme style sheet can be accessed within a component style sheet by
referencing their name, like so.

```ts
const styleSheet = createComponentStyles((css) => ({
  element: {
    animationName: 'fade 200ms, slide 3s',
  },
}));
```

> Do note that keyframe names must be globally unique to avoid collisions.

### Imports

Defines one or many [CSS files to import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import),
relative to the document root. An import can either be a proper CSS formatted string (including
quotes), or an object of `path` (required), `query`, and `url`.

```ts
const styleSheet = createThemeStyles(() => ({
  '@import': [
    // String
    'url("css/reset.css") screen',

    // Object
    {
      path: 'css/reset.css',
      media: 'screen',
      url: true,
    },
  ],
}));
```

If the `url` property is not defined, or is `false`, the import path will not be wrapped with
`url()`.

## References

The structure of this style sheet is based on types provided by the
[@aesthetic/sss](../packages/sss/README.md) package.

- [Local style sheets](../packages/sss/local.md)
- [Global style sheets](../packages/sss/global.md)
