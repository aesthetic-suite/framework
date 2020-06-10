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

```ts
// Left-to-right
const className = renderer.renderRule({
  marginLeft: '10px',
  paddingRight: 0,
  textAlign: 'left',
}); // -> a b c
```

```css
.a {
  margin-left: 10px;
}
.b {
  padding-right: 0;
}
.c {
  text-align: left;
}
```

RTL can be enabled when [rendering](./api.md) by using the `rtl` option.

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
```

```css
.d {
  margin-right: 10px;
}
.e {
  padding-left: 0;
}
.f {
  text-align: right;
}
```

> Many CSS properties and values that use the words "left" or "right" have been replaced by
> direction agnostic equivalents. Read the
> [RTL guidelines](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/RTL_Guidelines)
> for more information on these and how to properly mirror content.

## Unit suffixes

Defining a property value using a number (`10`) instead of a unit suffixed number (`10px`) is easier
to read and write, and as such, Aesthetic supports this pattern. By default, all numerical values
are automatically suffixed with `px`, unless the property in question requires no unit.

```ts
const className = renderer.renderRule({
  marginLeft: 10,
  lineHeight: 1.25,
}); // -> a b
```

```css
.a {
  margin-left: 10px;
}
.b {
  line-height: 1.25;
}
```

Units can be customized when [rendering](./api.md) by using the `unit` option. This option accepts a
string.

```ts
// All units as "rem"
const className = renderer.renderRule(
  {
    marginLeft: 10,
    paddingBottom: 15,
  },
  {
    unit: 'rem',
  },
); // -> a b
```

```css
.a {
  margin-left: 10rem;
}
.b {
  padding-bottom: 15rem;
}
```

Or a function that returns a string, in which the unit can be changed based on property name (in
kebab-case).

```ts
// Different unit per property
const className = renderer.renderRule(
  {
    marginLeft: 10,
    paddingBottom: 15,
  },
  {
    unit(prop) {
      if (prop === 'margin-left') return 'em';
      if (prop === 'padding-bottom') return '%';
      // Otherwise px
    },
  },
); // -> a b
```

```css
.a {
  margin-left: 10em;
}
.b {
  padding-bottom: 15%;
}
```

## Vendor prefixes

Aesthetic implements a custom runtime for
[vendor prefixing](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) properties,
values, and value functions, as we need full control of the implementation and browser targets.
Currently, features and browsers that are _not dead_ and have _>= 1% market share_ will apply vendor
prefixes.

```ts
// Without vendor prefixing
const className = renderer.renderRule({
  appearance: 'none',
  minWidth: 'fit-content',
}); // -> a b
```

```css
.a {
  appearance: none;
}
.b {
  min-width: fit-content;
}
```

Prefixes can be enabled when [rendering](./api.md) by using the `vendor` option.

```ts
// With vendor prefixing
const className = renderer.renderRule(
  {
    appearance: 'none',
    minWidth: 'fit-content',
  },
  { vendor: true },
); // -> a b
```

```css
.a {
  -ms-appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.b {
  min-width: -webkit-fit-content;
  min-width: fit-content;
}
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

When an application and its CSS grows, the chance for specificity issues gradually arise. For
example, if class `a` was rendered first, but we need it to override class `b`, which was rendered
later, this wouldn't be possible with the default atomic cache. To work around this, Aesthetic
supports the concept of specificity rankings, where each class name is given a rank based on
insertion order.

```ts
const a = renderer.renderDeclaration('color', 'red'); // -> a (rank 1)
const b = renderer.renderDeclaration('color', 'blue'); // -> b (rank 2)

// Will be blue, even though a comes after b
const className = `${b} ${a}`;
```

This ranking is not enabled by default, as it does insert duplicate properties to solve specificity
issues, which results in larger CSS. For example, for `a` to override `b` above, we would simply
insert a new class with the same declaration as `a`, which would result in a new class of `c` that
has a higher specificity.

To enable specificity rankings, pass an empty object to the `rankings` option. This object acts a
cache and lookup for rank resolutions.

```ts
const rankings = {};
const a = renderer.renderDeclaration('color', 'red', { rankings }); // -> a (rank 1)
const b = renderer.renderDeclaration('color', 'blue', { rankings }); // -> b (rank 2)
const c = renderer.renderDeclaration('color', 'red', { rankings }); // -> c (rank 3)

// Will be red since c overrides all
const className = `${b} ${a} ${c}`;
```
