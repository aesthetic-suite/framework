# Local At-rules

Local at-rules are at-rules that must be defined within a selector ruleset and cannot be defined in
the root of a component style sheet.

| Adapter   | @fallbacks | @media | @selectors | @supports |
| :-------- | :--------: | :----: | :--------: | :-------: |
| Aphrodite |            |   ✓    |     ✓      |           |
| Fela      |     ✓¹     |   ✓    |     ✓      |     ✓     |
| JSS       |     ✓      |   ✓    |     ✓      |     ✓     |
| TypeStyle |     ✓      |   ✓    |     ✓      |     ✓     |

> 1. Requires a plugin.

## @fallbacks

Define
[CSS property fallbacks](https://modernweb.com/using-css-fallback-properties-for-better-cross-browser-compatibility/)
for legacy browsers that do not support newer functionality. The at-rule requires an object, with
the key being a property name, and the value being a value, or an array of values.

```js
{
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
}
```

> Fela requires the `fela-plugin-fallback-value` plugin.

## @media

Define [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media) by mapping
breakpoints and queries to style rulesets. Can nest additional at-rules.

```js
{
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
}
```

## @selectors

Define advanced selectors that aren't type-safe or supported by
[csstype](https://github.com/frenic/csstype)'s standard attributes and pseudos. This includes:

- [Child combinators](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_combinator) denoted by
  a leading `>` (also known as direct descendents).
- [Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) that
  match against a value using patterns.
- [Pseudo class functions](https://developer.mozilla.org/en-US/docs/Web/CSS/:not) like `:not()` and
  `:nth-child()` (as they incur infinite combinations).
- Multiple selectors separated by a comma.

```js
{
  element: {
    '@selectors': {
      // Must start with >
      '> li': {
        listStyle: 'none',
      },

      // Must start with [
      '[href*="foo"]': {
        color: 'red',
      },

      // Must start with :
      ':not(:nth-child(9))': {
        display: 'hidden',
      },

      // Must be separated with a comma
      ':disabled, [disabled]': {
        opacity: .75,
      },
    },
  },
}
```

## @supports

Define [feature support](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) by mapping
property name queries to style rulesets. Can nest additional at-rules.

```js
{
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
}
```
