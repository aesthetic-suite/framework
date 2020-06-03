# API

## `Renderer`

### `RenderOptions`

Most render methods support the following options.

- `deterministic` (`boolean`) - Generate class names using a deterministic hash (`c1sjakp`) instead
  of an auto-incremented value (`a1`). Useful for scenarios like unit tests.
- `prefix` (`boolean`) - Apply vendor prefixes to properties and values that require it. We prefix
  features for browsers with > 1% market share.
- `rankings` (`object`) - An empty object to use for specificity ranking cache lookups. Useful for
  ensuring the correct specificity when order of declarations change.
- `rtl` (`boolean`) - Convert and swap LTR (left-to-right) based declarations to RTL
  (right-to-left).
- `selector` (`string`) - A CSS selector to scope the declaration(s) within. This is handled
  automatically when using [rules](#renderrule).

### `renderDeclaration`

> Renderer#renderDeclaration\<K extends Property>(property: K, value: Properties[K], options?:
> RenderOptions): ClassName

Renders a property-value pair, known as a CSS declaration, and returns a CSS class name. Will return
the same class name for the same property-value pair.

```ts
const className = renderer.renderDeclaration('display', 'block'); // -> a

// .a { display: block }
```

Declarations can also be scoped within a selector (pseudo, attribute, etc) by using the `selector`
option.

```ts
const className = renderer.renderDeclaration('display', 'block', { selector: ':hover' }); // -> b

// .b:hover { display: block }
```

### `renderRule`

> Renderer#renderRule(properties: Rule, options?: RenderOptions): ClassName

Renders a collection of property-value pairs, known as a CSS rule (or ruleset), and returns a CSS
class name for each declaration. A collection of declarations is known as a `style object`.

```ts
const className = renderer.renderRule({
  display: 'block',
  textAlign: 'center',
  background: 'transparent',
}); // -> a b c

// .a { display: block }
// .b { text-align: center }
// .c { background: transparent }
```

Rules can also infinitely render nested `@media` queries, `@supports` queries, pseudo classes and
elements, attributes, combinators, and other selectors, by declaring nested `style objects`.

```ts
const className = renderer.renderRule({
  display: 'block',
  background: 'gray',

  ':hover': {
    background: 'black',
  },

  '@media (max-width: 300px)': {
    display: 'inline-block',
  },
}); // -> a b c d
```

### `renderRuleGrouped`

> Renderer#renderRuleGrouped(properties: Rule, options?: RenderOptions): ClassName

Grouped rules work in a similar fashion to [rules](#renderrule), but instead of creating a unique
class per declaration (atomic), they group all declarations within a single class (non-atomic). This
exists for situations where all styles need to be encapsulated under a single class name, for
example, themes.

```ts
const className = renderer.renderRuleGrouped({
  display: 'block',
  textAlign: 'center',
  background: 'transparent',
}); // -> a

// .a {
//   display: block;
//   text-align: center;
//   background: transparent;
// }
```

### `renderFontFace`

> Renderer#renderFontFace(fontFace: FontFace, options?: RenderOptions): string

Renders a _font face object_ as a `@font-face` at-rule and returns the font family name. The
`fontFamily` property is required.

```ts
const fontFamily = renderer.renderFontFace({
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 800,
  src: 'url("fonts/Roboto.woff2")',
}); // -> Roboto

// @font-face { ... }
```

### `renderImport`

> Renderer#renderImport(path: string): void

Renders a CSS file path as an `@import` at-rule. Does not format the path, so proper quotes and
syntax is required.

```ts
renderer.renderImport('url("./path/to/file.css")');

// @import url("./path/to/file.css")
```

### `renderKeyframes`

> Renderer#renderKeyframes(keyframes: Keyframes, name?: string, options?: RenderOptions): string

Renders a _keyframes object_ as a `@keyframes` at-rule and returns the animation name. A custom
animation name may be provided as the 2rd argument (does not account for collision), or a unique one
will be generated.

```ts
const animationName = renderer.renderKeyframes({
  from: {
    transform: 'translateX(0%)',
  },
  to: {
    transform: 'translateX(100%)',
  },
}); // -> kf18jdch28d

// @keyframes kf18jdch28d { ... }
```

## `ClientRenderer`

### `hydrateStyles`

> ClientRenderer#hydrateStyles(): void

Queries the document for all Aesthetic owned `style` tags (rendered by the server) and hydrates the
renderer's cache will applicable CSS information -- everything from class names to at-rules.

```ts
renderer.hydrateStyles();
```

## `ServerRenderer`

Read the documentation on [server-side rendering](./ssr.md) to utilize this correctly.

### `extractStyles`

> ServerRenderer#extractStyles(app: React.ReactElement): React.ReactElement

Extracts critical CSS from the application being rendered (without layout HTML) by injecting the
current server renderer. CSS must then be [rendered to style tags](#rendertostylemarkup).

```tsx
const app = renderer.extractStyles(<App />);
```

### `renderToStyleMarkup`

> ServerRenderer#renderToStyleMarkup(): string

Renders [extracted styles](#extractstyles) into a collection of `style` tags for
[hydration](#hydratestyles). Tags must be included in the HTML response.

```ts
const markup = renderer.renderToStyleMarkup();
```
