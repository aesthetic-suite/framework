# Local At-rules

Local at-rules are at-rules that must be defined within a selector and cannot be defined in the root
of a component style sheet.

## @fallbacks

Supported by Fela, Glamor, JSS, and TypeStyle.

```javascript
{
  element: {
    // ...
    background: 'linear-gradient(...)',
    display: 'flex',

    '@fallbacks': {
      background: 'red',
      display: ['block', 'inline-block'],
    },
  },
}
```

> Fela requires the `fela-plugin-fallback-value` plugin.

## @media

Supported by all adapters.

```javascript
{
  element: {
    maxWidth: 300,

    '@media': {
      '(min-width: 400px)': {
        maxWidth: 'auto',
      },
    },
  },
}
```

## @selectors

Supported by all adapters.

```javascript
{
  element: {
    '@selectors': {
      '> li': {
        listStyle: 'none',
      },

      '[href*="foo"]': {
        color: 'red',
      },

      ':not(:nth-child(9))': {
        display: 'hidden',
      },
    },
  },
}
```

> Should only be used for advanced attributes, pseudos, and direct descendents.

## @supports

Supported by Fela, Glamor, JSS, and TypeStyle.

```javascript
{
  element: {
    float: 'left',

    '@supports': {
      '(display: flex)': {
        float: 'none',
        display: 'flex',
      },
    },
  },
}
```
