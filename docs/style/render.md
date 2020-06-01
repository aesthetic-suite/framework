# Renderer

TODO Talk about nested objects.

## Declarations

A [declaration](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#CSS_declarations) is the
pairing of a single CSS property to a value, and can be rendered using the
`renderDeclaration(property, value, options?)` method, which returns a string with a single
consistent class name.

```ts
const className = renderer.renderDeclaration('display', 'block'); // -> a

// .a { display: block }
```

## Rules

A [rule (or ruleset)](https://developer.mozilla.org/en-US/docs/Web/CSS/Syntax#CSS_rulesets) is a
collection of multiple CSS declarations, represented by a plain object known as a _style object_.
They are rendered with `renderRule(properties, options?)`, which returns a string with a class name
for every property.

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

> Why are rules not called "declaration blocks"? Since a rule can have nested rules, instead of just
> properties, the declaration block terminology didn't match the scope of provided functionality,
> while rule/ruleset terminology aligns more closely.

## Grouped Rules

Grouped rules work in a similar fashion to [rules](#rules), but instead of creating a unique class
per declaration (atomic), they group all declarations within a single class (non-atomic). This
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

> This method should rarely be used, as it circumvents the performance and filesize gains that the
> atomic cache provides.

## Font Faces

## Imports

## Keyframes
