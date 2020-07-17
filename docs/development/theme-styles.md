# Theme style sheets

While [component style sheets](./component-styles.md) are used to style elements in isolation, a
theme style sheet is used to style the document (or a container), while also providing global
at-rules like font faces or keyframes.

Use the `createThemeStyles()` method to create a theme style sheet. Once ready for production, the
style sheet can be passed on a theme-by-theme basis during registration with `registerTheme()` or
`registerDefaultTheme()`. Feel free to add a style sheet to one or many themes.

```ts
import { createThemeStyles } from '@aesthetic/core';

const styleSheet = createThemeStyles(() => ({
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  },
}));
```

## Using tokens

Themes style sheets can also use design tokens provided by an upstream design system. For more
information on how to use design tokens, jump to the
[component style sheet documentation](./component-styles.md#using-tokens).

```ts
const styleSheet = createThemeStyles((css) => ({
  '@global': {
    fontSize: css.var('text-df-size'),
  },
}));
```

## Styling themes

### Containers

### Font faces

### Keyframes

### Imports

## Rendering CSS

## References

The structure of this style sheet is based on types provided by the
[@aesthetic/sss](../packages/sss/README.md) package.

- [Local style sheets](../packages/sss/local.md)
- [Global style sheets](../packages/sss/global.md)
