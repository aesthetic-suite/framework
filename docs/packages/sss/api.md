# API

## `Parser`

Accepts an object of event listeners through the constructor. Applies to all sub-classes.

- `onBlock` - Emits for each style object.
- `onBlockAttribute` - Emits for each HTML within a style object.
- `onBlockFallback` - Emits for each property within `@fallbacks` within a style object.
- `onBlockMedia` - Emits for each `@media` within a style object.
- `onBlockProperty` - Emits for each property within a style object.
- `onBlockPseudo` - Emits for each pseudo element/class within a style object.
- `onBlockSelector` - Emits for each selector within `@selectors` within a style object.
- `onBlockSupports` - Emits for each `@supports` within a style object.
- `onBlockVariable` - Emits for each CSS variable within a style object.
- `onBlockVariant` - Emits for each variant within `@variants` within a style object.
- `onFontFace` - Emits for each `@font-face` and each inlined into `fontFamily`.
- `onKeyframes` - Emits for each `@keyframes` and each inlined into `animationName`.
- `onVariable` - Emits for each variable within `@variables`.

## `LocalParser`

```ts
const parser = new LocalParser({
  onBlock() {},
  onClass() {},
});
```

Supports the following additional events:

- `onClass` - Emits when a class name is passed instead of a style object.
- `onRule` - Emits when a rule is parsed. A rule represents each key-value pair in the style sheet.

### `parse`

> LocalParser#parse(styleSheet: LocalStyleSheet): void

Parsers a local style sheet instance and emits an event for every node parsed.

```ts
parser.parser({
  element: {
    display: 'flex',
  },
});
```

## `GlobalParser`

```ts
const parser = new GlobalParser({
  onBlock() {},
  onRoot() {},
  onViewport() {},
});
```

Supports the following additional events:

- `onImport` - Emits for each `@import`.
- `onPage` - Emits for each `@page`.
- `onRoot` - Emits when `@root` is parsed as a local style sheet.
- `onViewport` Emits for `@viewport`.

### `parse`

> GlobalParser#parse(styleSheet: GlobalStyleSheet): void

Parsers a global style sheet instance and emits an event for every node parsed.

```ts
parser.parser({
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
});
```
