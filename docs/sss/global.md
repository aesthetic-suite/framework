# Global styles

A global style sheet serves 2 purposes. The 1st is that it houses all at-rules that should be
processed at the document level, and not the element level. The 2nd is for defining global-like
styles, in which `body` style declarations can be defined, and should typically be scoped within a
class name to avoid collisions.

The `GlobalStyleSheet` interface can be used for type information.

```ts
import { GlobalStyleSheet } from '@aesthetic/sss';
```

## Structure

For global style sheets, the following at-rules are the only values that may be defined in the root
of the sheet.

### `@font-face`

Defines a [font face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) that can be
referenced with the `fontFamily` property. The at-rule requires an object, with the font family name
as the key, and the font face(s) as the value. Each font face requires a `srcPaths` array.

```ts
const globalSheet: GlobalStyleSheet = {
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
const globalSheet: GlobalStyleSheet = {
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

> The `fontFamily` property can be omitted within the font face as it'll be inherited from the
> at-rule key.

Emits a `font-face` event for each declaration.

### `@global`

As stated at the start of the chapter, the global style sheet can generate global-like CSS styles by
using the `@global` at-rule. This at-rule is a [local style sheet](./local.md) that should be
processed and generated to a class name that is set on the `body`. It's built this way to avoid
global collisions between multiple themes or differing global style sheets.

```ts
const globalSheet: GlobalStyleSheet = {
  '@global': {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 1.5,
    backgroundColor: 'white',
    color: 'black',
    height: '100%',
    margin: 0,
    padding: 0,

    '@media': {
      '(max-width: 400px)': {
        fontSize: 14,
        lineHeight: 1.25,
      },
    },

    '@selectors': {
      a: {
        color: 'blue',
      },

      p: {
        margin: 8,
      },
    },
  },
};
```

> The `html`, `:root`, or `*` global styles cannot be defined with a global style sheet. Those
> category of globals should be handled outside of this system.

Emits a single `global` event.

### `@import`

Defines one or many [CSS files to import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import),
relative to the document root. An import can either be a proper CSS formatted string (including
quotes), or an object of `path` (required), `query`, and `url`.

```ts
const globalSheet: GlobalStyleSheet = {
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
};
```

If the `url` property is not defined, or is `false`, the import path will not be wrapped with
`url()`.

Emits an `import` event for each import.

### `@keyframes`

Defines a [keyframes animation](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) that
can be referenced with the `animationName` property. The at-rule requires an object, with the
animation name as the key, and the keyframes as the value. Supports both range (from/to) and
percentage based sequences.

```ts
const globalSheet: GlobalStyleSheet = {
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
};
```

Emits a `keyframes` event for each declaration.

### `@page`

Defines a ruleset to be applied when the
[document is printed](https://developer.mozilla.org/en-US/docs/Web/CSS/@page). Supports standard and
pseudo-class (`:blank`, `:first`, `:left`, `:right`) declaration blocks.

```ts
const globalSheet: GlobalStyleSheet = {
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
const globalSheet: GlobalStyleSheet = {
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

Emits a `page` event for each declaration, including selectors.

### `@viewport`

Defines a ruleset that dictates how the
[viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport) operates. Only accepts width,
height, zoom, and orientation related properties.

```ts
const globalSheet: GlobalStyleSheet = {
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
};
```

Emits a `viewport` event.

## Parsing

To parse a style sheet, import and instantiate the `GlobalParser`. To streamline consumption, the
parser utilizes an event emitter, where each at-rule must be listened to and handled. Once listeners
are registered, execute the `parse()` method with the style sheet.

Because of this architecture, you must "build" or "handle" the final result yourself. In the example
below, when an event is emitted, we will insert a formatted rule into our style sheet.

```ts
import { GlobalParser } from '@aesthetic/sss';

const sheet = new CSSStyleSheet();

const parser = new GlobalParser({
  onFontFace(fontFace, family) {
    sheet.insertRule(`@font-face { ${cssify(fontFace)} }`, sheet.cssRules.length);

    return family;
  },
  onImport(path) {
    sheet.insertRule(`@import ${path};`, sheet.cssRules.length);
  },
  onKeyframes(keyframes, name) {
    sheet.insertRule(`@keyframes ${name} { ${cssify(keyframes)} }`, sheet.cssRules.length);

    return name;
  },
  onPage(page) {
    sheet.insertRule(`${page.selector} { ${cssify(page)} }`, sheet.cssRules.length);
  },
  onViewport(viewport) {
    sheet.insertRule(`@viewport { ${cssify(viewport)} }`, sheet.cssRules.length);
  },
});

parser.parse({
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
});
```

> The full list of events and their types can be found in the
> [source `Parser` class](https://github.com/milesj/aesthetic/blob/master/packages/sss/src/Parser.ts).
