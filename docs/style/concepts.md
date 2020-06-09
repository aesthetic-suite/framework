# Rendering concepts

To understand Aesthetic and the rendering process, there are a few key concepts around styling and
its structure.

## Styles

All styling is defined through _style objects_, which are plain JavaScript objects that map CSS
properties to values, also known as a
[CSS declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#CSS_declarations). There
are additional types of style objects that provide more functionality, and can be found below.

### Rules

A [rule (or ruleset)](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#CSS_rulesets) is a
collection of multiple CSS declarations, with optional support for nested rules and selectors.

#### Pseudos and attributes

#### Media queries

#### Support queries

#### Combinators and other selectors

#### Variables

### Font Faces

Font faces allow for [custom fonts](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) to
be used, are represented by the `@font-face` at-rule, and are defined using a _font face object_.
Font face objects only support a subset of properties, primarily font related ones, and the`src`
property, which points to a source font file (relative or absolute to the document root).

```ts
import { FontFace } from '@aesthetic/style';

const fontFace: FontFace = {
  fontFamily: '"Open Sans"',
  fontStyle: 'normal',
  fontWeight: 800,
  src: 'url("fonts/OpenSans-Bold.woff2")',
};
```

Font faces can be rendered with the [renderFontFace()](./api.md#renderfontface) method.

### Imports

Imports are used to include external
[CSS style sheets](https://developer.mozilla.org/en-US/docs/Web/CSS/@import), not CSS-in-JS, with
the `@import` at-rule. Since imports are strings and not objects, be sure to properly
[quote](#properly-quoted-quotes) and use valid syntax.

```ts
const path = '"test.css"';
const path = 'url("test.css")';
const path = 'url("test.css") print';
```

Imports can be rendered with the [renderImport()](./api.md#renderimport) method.

### Keyframes

Keyframes are [CSS animation sequences](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes)
that are represented by the `@keyframes` at-rule, and are defined using a _keyframes object_. A
keyframes object maps frames to [rules](#rules), where each frame is one of `to`, `from`, or a
percentage.

```ts
import { Keyframes } from '@aesthetic/style';

const keyframes: Keyframes = {
  from: { marginTop: 50 },
  '50%': { marginTop: 150 },
  to: { marginTop: 100 },
};
```

Keyframes can be rendered with the [renderKeyframes()](./api.md#renderkeyframes) method.

## Caveats

Because both atomic CSS _and_ CSS-in-JS is utilized, there are a few caveats to be aware of while
using this library.

### Properly quoted values

Any property value that requires quotes must be properly quoted or escaped on the JavaScript side.
This primarily applies to the `content` property and `@import` at-rule, but is useful in other
contexts.

```ts
// Invalid
const rule: Rule = {
  content: 'Hello',
};

// Valid
const rule: Rule = {
  content: '"Hello"',
};
```

### Mixing of shorthand and longhand properties

One of the biggest disadvantages to atomic CSS is that
[shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) make
it incredibly difficult to apply styles correctly. Since a shorthand property is the combination of
multiple properties, but is represented as a single class name, how can we ensure the correct
specificity order? Take the following for example.

```ts
const rule: Rule = {
  border: '1px solid black',
  borderColor: 'white',
};
```

If this example was rendered as-is, the border color would be white, since `borderColor` is ordered
after `border`. However, when used in an application with hundreds of rules, we can't ensure this
order, as `borderColor` may have been rendered much earlier than `border`, or vice-versa. Now
compound this problem with the other properties involved, like `borderStyle` and `borderWidth`.
Which should take precedence? And how?

To work around this, we suggest _always_ using the longhand properties, since it's far more
explicit. This suggestion does require more code and overhead, but is better in the long-term for
maintainability.

```ts
const rule: Rule = {
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: 'white',
};
```

> In the future, we will provide an ESLint rule to help mitigate this issue.
