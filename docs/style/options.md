# Options

The following features can be enabled on case-by-case basis using render options.

## Deterministic classes

Since the style engine generates atomic CSS, the amount of class names required grows rather
quickly, as we need 1 class name for every 1 declaration. Class names use an autoincremented
approach, where we combine an alphabet character and a counter, to return names like `a`, `j4`, and
`z8`. However, the class name returned for a declaration cannot be guaranteed, as the order of
insertion may change, or the autoincremented value may differ, as shown below.

```ts
renderer.renderDeclaration('margin', 0); // -> a
renderer.renderDeclaration('display', 'flex'); // -> b

// Page refreshed and order changes
renderer.renderDeclaration('display', 'flex'); // -> a
renderer.renderDeclaration('margin', 0); // -> b
```

That being said, Aesthetic does support the concept of deterministic classes, where the same class
name will always be returned for the same declaration, regardless of insertion order or other
factors. Perfect for scenarios like unit testing. It does this by hashing the CSS rule itself, and
generating a unique class name based on the hash.

Deterministic classes can be enabled when [rendering](./api.md) by using the `deterministic` option.

```ts
renderer.renderDeclaration('margin', 0, { deterministic: true }); // -> c1cpw2zw
renderer.renderDeclaration('display', 'flex', { deterministic: true }); // -> cu4ygwf

// Page refreshed and order changes
renderer.renderDeclaration('display', 'flex', { deterministic: true }); // -> cu4ygwf
renderer.renderDeclaration('margin', 0, { deterministic: true }); // -> c1cpw2zw
```

## Directionality

Directionality is the concept of localizing the direction of styles to support
[RTL (right-to-left)](https://developer.mozilla.org/en-US/docs/Glossary/rtl) languages. By default,
Aesthetic assumes and requires all styles to be
[LTR (left-to-right)](https://developer.mozilla.org/en-US/docs/Glossary/LTR). To swap property and
value direction, we utilize the popular [rtl-css-js](https://github.com/kentcdodds/rtl-css-js)
library.

RTL can be enabled when [rendering](./api.md) by using the `rtl` option.

```ts
// Left-to-right
const className = renderer.renderRule({
  marginLeft: '10px',
  paddingRight: 0,
  textAlign: 'left',
}); // -> a b c

// .a { margin-left: 10px; }
// .b { padding-right: 0; }
// .c { text-align: left; }
```

```ts
// Right-to-left
const className = renderer.renderRule(
  {
    marginLeft: '10px',
    paddingRight: 0,
    textAlign: 'left',
  },
  {
    rtl: true,
  },
); // -> d e f

// .d { margin-right: 10px; }
// .e { padding-left: 0; }
// .f { text-align: right; }
```

> Many CSS properties and values that use the words "left" or "right" have been replaced by
> direction agnostic equivalents. Read the
> [RTL guidelines](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/RTL_Guidelines)
> for more information on these and how to properly mirror content.

## Vendor prefixes

Aesthetic implements a custom runtime for
[vendor prefixing](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) properties,
values, and value functions, as we need full control of the implementation and browser targets.
Currently, features and browsers that are _not dead_ and have _>= 1% market share_ will apply vendor
prefixes.

Prefixes can be enabled when [rendering](./api.md) by using the `prefix` option.

```ts
// Without prefixing
const className = renderer.renderRule({
  appearance: 'none',
  minWidth: 'fit-content',
}); // -> a b

// .a { appearance: none; }
// .b { min-width: fit-content; }
```

```ts
// With prefixing
const className = renderer.renderRule(
  {
    appearance: 'none',
    minWidth: 'fit-content',
  },
  { prefix: true },
); // -> a b

// .a {
//   -ms-appearance: none;
//   -moz-appearance: none;
//   -webkit-appearance: none;
//   appearance: none;
// }
// .b {
//   min-width: -webkit-fit-content;
//   min-width: fit-content;
// }
```

> What if prefixes are missing for a feature I would expect them to, like CSS flexbox? In most
> cases, the feature in question is actually fully supported by our browser targets, so vendor
> prefixes are not necessary! When in doubt, verify on
> [caniuse.com](https://caniuse.com/#search=flexbox).

### Minimum browser support

- Chrome v77
- Chrome for Android v78
- Edge v18
- Firefox v70
- Internet Explorer v11
- Safari v13
- Safari for iOS v12.4
- Samsung Internet v10.1
- UC Browser for Android v12.12

## Specificity rankings

TODO
