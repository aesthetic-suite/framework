# Local styles

A local style sheet defines styles for multiple elements within a single component by mapping
selectors (elements and element states) to style declarations, which is known as a ruleset. Within
each declaration, standard CSS properties can be defined, as well as element level at-rules.

The `LocalStyleSheet` interface can be used for type information.

```ts
import { LocalStyleSheet } from '@aesthetic/sss';
```

## Structure

As mentioned above, local style sheets map selectors to style declarations. You can imagine a
selector as either an element or an element state, like the following.

```ts
const localSheet: LocalStyleSheet = {
  modal: {
    display: 'block',
  },
  modal_hidden: {
    display: 'none',
  },
  modal_fixed: {
    position: 'fixed',
  },
  modalHeader: {},
  modalBody: {},
  modalBody_overflow: {},
  modalFooter: {},
};
```

In the example above, we have 4 elements denoted by camel case names, and 3 states/modifiers denoted
by underscores. We use a BEM-like format to easily differentiate purpose, but feel free to write
selectors however you please!

Besides standard CSS properties, the following at-rules can be defined within each selector ruleset,
and are _not allowed_ in the sheet root.

### `@fallbacks`

Defines
[CSS property fallbacks](https://modernweb.com/using-css-fallback-properties-for-better-cross-browser-compatibility/)
for legacy browsers that do not support newer properties. The at-rule requires an object, with the
key being a property name, and the value being a property value, or an array of values.

```ts
const localSheet: LocalStyleSheet = {
  element: {
    background: 'linear-gradient(...)',
    display: 'flex',

    '@fallbacks': {
      // Single fallback
      background: 'red',
      // Multiple fallbacks
      display: ['block', 'inline-block'],
    },
  },
};
```

Emits a `block:fallback` event per property with an array of values.

### `@media`

Defines [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media) by mapping
breakpoints and queries to style declarations. Declarations can nest selectors and additional
at-rules.

```ts
const localSheet: LocalStyleSheet = {
  element: {
    maxWidth: 300,

    '@media': {
      '(min-width: 400px)': {
        maxWidth: 'auto',
      },
      'screen and (min-width: 1800px)': {
        maxWidth: '100%',
      },
    },
  },
};
```

Emits a `block:media` event per media query declaration.

### `@selectors`

Defines advanced [selectors](./spec.md#selectors) that aren't type-safe or supported by
[csstype](https://github.com/frenic/csstype)'s standard attributes and pseudos. This includes:

- [Combinators](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators) denoted
  by a leading `>` (also known as direct descendents).
- [Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) that
  match against a value using patterns.
- [Pseudo class functions](https://developer.mozilla.org/en-US/docs/Web/CSS/:not) like `:not()` and
  `:nth-child()` (as they incur infinite combinations).
- Multiple selectors separated by a comma.

```ts
const localSheet: LocalStyleSheet = {
  element: {
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
};
```

Emits a `block:selector`, `block:pseudo`, or `block:attribute` event per selector declaration.

### `@supports`

Defines [supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) by mapping feature
queries to style declarations. Declarations can nest selectors and additional at-rules.

```ts
const localSheet: LocalStyleSheet = {
  element: {
    float: 'left',

    '@supports': {
      '(display: flex)': {
        float: 'none',
        display: 'flex',
      },
      'not (display: grid)': {
        display: 'block',
      },
    },
  },
};
```

Emits a `block:media` event per feature query declaration.

### `@variables`

Defines element level CSS variables, by mapping variable names to their value. Names can be in camel
case or variable kebab case (prefixed with `--`). Useful for overriding root and theme CSS variables
on a per element basis.

```ts
const localSheet: LocalStyleSheet = {
  element: {
    '@variables': {
      spacingDf: '1.5rem',
      '--spacing-df': '1.5rem',
    },
  },
};
```

> Variable values are not transformed in any way, so they must be explicit. For example, unitless
> values are not supported for values that require a unit suffix.

Emits a `block:variable` event for each CSS variable.

### `@variants`

Defines multiple variations for the rule in question. Each variation is a style object that maps to
a specific variation type and value combination, defined by the object key and separated by a
_single_ underscore.

```ts
const localSheet: LocalStyleSheet = {
  element: {
    display: 'block',

    '@variants': {
      size_small: { fontSize: 14 },
      size_default: { fontSize: 16 },
      size_large: { fontSize: 18 },

      type_failure: {},
      type_success: {},
      type_brandPrimary: {},
    },
  },
};
```

The variant block _does not_ merge into the parent block, as the consumer should handle what to do
with variants. If no custom handling is provided, variants are a no-op.

Emits a `block:variant` event for each CSS variant object.

## Parsing

To parse a style sheet, import and instantiate the `LocalParser`. To streamline consumption, the
parser utilizes an event emitter, where each at-rule must be listened to and handled. Once listeners
are registered, execute the `parse()` method with the style sheet.

Because of this architecture, you must "build" or "handle" the final result yourself. However, any
event that starts with `block:` is automatically handled by modifying the object used in the parent
`block` and `ruleset` events. Typically these do not need to be defined.

```ts
import { LocalParser } from '@aesthetic/sss';

const sheet = new CSSStyleSheet();

const parser = new LocalParser({
  // For `fontFamily` property
  onFontFace(fontFace, family) {
    sheet.insertRule(`@font-face { ${cssify(fontFace)} }`, sheet.cssRules.length);

    return family;
  },
  // For `animationName` property
  onKeyframes(keyframes, name) {
    sheet.insertRule(`@keyframes ${name} { ${cssify(keyframes)} }`, sheet.cssRules.length);

    return name;
  },
  onRuleset(name, selector, declaration) {
    sheet.insertRule(
      `.${createClassName(selector)} { ${cssify(declaration)} }`,
      sheet.cssRules.length,
    );
  },
});

parser.parse({
  container: {
    display: 'flex',
    maxWidth: '100%',
  },

  button: {
    display: 'inline-block',
    textAlign: 'center',
    padding: '8px 12px',
    borderRadius: '3px',
  },

  button_active: {
    fontWeight: 'bold',
  },
});
```

> The full list of events and their types can be found in the
> [source `Parser` class](https://github.com/aesthetic-suite/framework/blob/master/packages/sss/src/Parser.ts).
