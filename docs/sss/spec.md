# Specification

## Font Faces

A font face is a unique declaration used by [`@font-face` at-rules](./global.md#font-face) and
[local fonts](#fonts). Unlike normal CSS where you define a `src` property, in Aesthetic you define
`srcPaths`, which is an array of paths to the source files. This allows consumers to operate on
paths individually.

```ts
import { FontFace } from '@aesthetic/sss';

const fontFace: FontFace = {
  fontStyle: 'normal',
  fontWeight: 'normal',
  srcPaths: ['fonts/OpenSans.ttf'],
};
```

Furthermore, local source aliases (`local()`) can be defined by passing an array of names to a
`local` property.

```ts
const fontFace: FontFace = {
  fontStyle: 'normal',
  fontWeight: 'normal',
  local: ['OpenSans', 'Open-Sans'],
  srcPaths: ['fonts/OpenSans.ttf'],
};
```

> The `local` and `srcPaths` properties are unique to Aesthetic and aren't an official CSS property.

## Keyframes

Keyframes are another unique declaration that are used by
[`@keyframes` at-rules](./global.md#keyframes) and [local animations](#animations). They support
both from/to and percentage based formats.

```ts
import { Keyframes } from '@aesthetic/sss';

const fromTo: Keyframes = {
  from: { opacity: 0 },
  to: { opacity: 1 },
};

const percentage: Keyframes = {
  '0%': { left: '0%' },
  '50%': { left: '75%' },
  '100%': { left: '100%' },
};
```

## Properties

The foundation of all styles are properties, where each key-value pair maps to a
[CSS declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#CSS_declarations), and
abides the following:

- Property names are camel cased versions of their CSS equivalent property.
- Vendor properties are _not_ supported. Use the `vendorPrefixes` settings to enable this
  automatically.
- Unit values that default to the `defaultUnit` setting can be written as literal numbers.
- Values that require quotes in the CSS output must manually handle the quotes within the string.

```ts
import { DeclarationBlock } from '@aesthetic/sss';

const styles: DeclarationBlock = {
  margin: 0,
  padding: 5,
  display: 'inline-block',
  lineHeight: 'normal',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#ccc',
  color: '#000',
  content: '"Title"',
};
```

### Animations

Inline keyframes can be defined by passing an object or an array of objects to `animationName`,
where each object abides the [keyframes](#keyframes) specification.

```ts
import { DeclarationBlock } from '@aesthetic/sss';

// Reference global keyframes by name
const styles: DeclarationBlock = {
  animationName: 'fade, slide',
};

// Single animation
const styles: DeclarationBlock = {
  animationName: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

// Multiple animations
const styles: DeclarationBlock = {
  animationName: [
    'slide', // Reference a global
    {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    {
      '0%': { bottom: 0 },
      '100%': { bottom: '100%' },
    },
  ],
};
```

### Fonts

Inline font faces can be defined by passing an object or an array of objects to `fontFamily`, where
each object abides the [font face](#font-face) specification. This approach requires an explicit
`fontFamily` for each font face.

```ts
import { DeclarationBlock } from '@aesthetic/sss';

// Reference global font by name
const styles: DeclarationBlock = {
  fontFamily: '"Open Sans", Roboto',
};

// Single font
const styles: DeclarationBlock = {
  fontFamily: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
  },
};

// Multiple fonts
const styles: DeclarationBlock = {
  fontFamily: [
    'Roboto', // Reference a global font
    {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
    {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: 800,
      srcPaths: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
    },
  ],
};
```

### Expanded properties

CSS has a concept known as
[shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties), where
multiple properties and their values can be declared with a single property. For example,
`border-width`, `border-style`, and `border-color` can be combined in `border`.

However, in CSS-in-JS, shorthand properties cause issues when defined alongside their longhand
properties, so Aesthetic offers an expanded form for a handful of shorthand properties (cue irony).
The current shorthand properties that support an expanded form are: `animation`, `background`,
`border`, `borderBottom`, `borderLeft`, `borderRight`, `borderTop`, `columnRule`, `flex`, `font`,
`listStyle`, `margin`, `offset`, `outline`, `padding`, `textDecoration`, and `transition`;

To utilize the expanded form, define an object where each property within maps to an equivalent
longhand property. Using the border example above, the object would look like the following:

```ts
import { DeclarationBlock } from '@aesthetic/sss';

const styles: DeclarationBlock = {
  // Shorthand
  border: '1px dashed red',

  // Longhand
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: 'red',

  // Expanded
  border: {
    width: 1,
    style: 'dashed',
    color: 'red',
  },
};
```

## Selectors

For proper type-safety and isolation, only static attribute and pseudo selectors are supported, as
dynamic selectors with an infinite number of combinations or permutations cannot be typed. The list
of supported selectors can be found in the [csstype](https://github.com/frenic/csstype) library,
primarily `SimplePseudos` and `HtmlAttributes`.

### Attributes

Attribute selectors can be defined by wrapping the attribute name in square brackets.

```ts
import { DeclarationBlock } from '@aesthetic/sss';

const styles: DeclarationBlock = {
  // ...
  '[disabled]': {
    opacity: 0.3,
  },
};
```

### Pseudos

Pseudo classes and pseudo elements can be defined by prefixing the pseudo name with a `:` or `::`
respectively.

```ts
import { DeclarationBlock } from '@aesthetic/sss';

const styles: DeclarationBlock = {
  // ...
  ':hover': {
    backgroundColor: '#eee',
  },
  '::before': {
    content: '"★"',
    display: 'inline-block',
    marginRight: 5,
  },
};
```
