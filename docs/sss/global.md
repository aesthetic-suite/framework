# Global StyleSheet

The global style sheet houses at-rules that should only be processed at the document level -- not
the component level -- and can be used to generate global styles that are scoped within a single
class name.

## Parsing

TODO

## Specification

### `@charset`

Sets the document [character set](https://developer.mozilla.org/en-US/docs/Web/CSS/@charset).
Accepts a [IANA registry](http://www.iana.org/assignments/character-sets) valid string.

```ts
const globalSheet = {
  '@charset': 'utf-8',
};
```

### `@font-face`

Defines a [font face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) that can be
referenced with the `fontFamily` property. The at-rule requires an object, with the font family name
as the key, and the font face(s) as the value. Each font face requires an array of `srcPaths`.

```ts
const globalSheet = {
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  },
};
```

To support multiple font variations, like bold and italics, pass an array of font faces.

```ts
const globalSheet = {
  '@font-face': {
    'Open Sans': [
      {
        fontStyle: 'normal',
        fontWeight: 'normal',
        srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
      },
      {
        fontStyle: 'italic',
        fontWeight: 'normal',
        srcPaths: ['fonts/OpenSans-Italic.woff2', 'fonts/OpenSans-Italic.ttf'],
      },
      {
        fontStyle: 'normal',
        fontWeight: 'bold',
        srcPaths: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
      },
    ],
  },
};
```

To define `local()` source aliases, pass an array of strings to a `local` property.

```ts
const globalSheet = {
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      local: ['OpenSans', 'Open-Sans'],
      srcPaths: ['fonts/OpenSans.ttf'],
    },
  },
};
```

> The `fontFamily` property can be omitted as it'll be inherited from the at-rule key.

### `@global`

TODO

### `@import`

Defines one or many [CSS files to import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import),
relative to the document root. An import can either be a proper CSS formatted string (including
quotes), or an object of `path` (required), `query`, and `url`.

```ts
const globalSheet = {
  '@import': [
    // String
    'url("css/reset.css") screen',

    // Object
    {
      path: 'css/reset.css',
      query: 'screen',
      url: true,
    },
  ],
};
```

If the `url` property is not defined, or is `false`, the import path will not be wrapped with
`url()`.

### `@keyframes`

Defines a [keyframes animation](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) that
can be referenced with the `animationName` property. The at-rule requires an object, with the
animation name as the key, and the keyframes as the value. Supports both `from/to` and percentage
based sequences.

```ts
const globalSheet = {
  '@keyframes': {
    // From -> to
    fade: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },

    // Percentage
    slide: {
      '0%': { left: 0 },
      '50%': { left: '75%' },
      '100%': { left: '100%' },
    },
  },
};
```

### `@page`

Defines a ruleset to be applied when the
[document is printed](https://developer.mozilla.org/en-US/docs/Web/CSS/@page). Supports standard and
pseudo-class (`:blank`, `:first`, `:left`, `:right`) declaration blocks.

```ts
const globalSheet = {
  '@page': {
    margin: '1cm',

    ':first': {
      margin: '2cm',
    },
  },
};
```

Page type selectors are also supported, and can be defined with an object, where the key is the
selector. They can be defined in both standard and pseudo-class blocks.

```ts
const globalSheet = {
  '@page': {
    size: '8.5in 11in',

    '@top-right': {
      content: '"Page" counter(page)',
    },

    ':blank': {
      '@top-center': {
        content: '"This page is intentionally left blank."',
      },
    },
  },
};
```

### `@viewport`

Defines a ruleset that dictates how the
[viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport) operates. Only accepts width,
height, zoom, and orientation related properties.

```ts
const globalSheet = {
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
};
```
