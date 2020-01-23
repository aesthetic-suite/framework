# Global Styles

The global style sheet houses at-rules that should only be processed at the document level -- not
the component level. It can also be used to generate global styles that should be scoped within a
class name to avoid collisions.

## Parsing

To parse a style sheet, import and instantiate the `GlobalParser`. Parsing is asynchronous, so to
streamline consumption, the parser utilizes an event emitter, where each at-rule must be listened to
and handled. Once registered, call the `parse()` method with the style sheet.

Because of this architecture, you must "build" or "handle" the final result yourself. For example,
when an event is emitted, we will insert a formatted rule into our style sheet.

```ts
import { GlobalParser } from '@aesthetic/sss';

const sheet = new CSSStyleSheet();

const parser = new GlobalParser()
  .on('charset', charset => {
    sheet.insertRule(`@charset "${charset}";`, 0);
  })
  .on('font-face', fontFace => {
    sheet.insertRule(`@font-face { ${cssify(fontFace)} }`, sheet.cssRules.length);
  })
  .on('import', path => {
    sheet.insertRule(`@import ${path};`, sheet.cssRules.length);
  })
  .on('keyframes', (keyframes, name) => {
    sheet.insertRule(`@keyframes ${name} { ${cssify(keyframes)} }`, sheet.cssRules.length);
  })
  .on('page', page => {
    sheet.insertRule(`${page.selector} { ${cssify(page)} }`, sheet.cssRules.length);
  })
  .on('viewport', viewport => {
    sheet.insertRule(`@viewport { ${cssify(viewport)} }`, sheet.cssRules.length);
  });

await parser.parse({
  '@charset': 'utf-8',
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
});
```

TODO add link to list of events

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
as the key, and the font face(s) as the value. Each font face requires a `srcPaths` array.

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

> The `fontFamily` property can be omitted within the font face as it'll be inherited from the
> at-rule key.

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
animation name as the key, and the keyframes as the value. Supports both from/to and percentage
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
      '0%': { left: '0%' },
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

Page type selectors are also supported, and are defined with an object, where the key is the
selector, and the value are property declarations. They can be defined in both standard and
pseudo-class blocks.

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
