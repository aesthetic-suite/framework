# Local At-rules

Local at-rules are at-rules that must be defined within a selector and cannot be defined in the
root of a style sheet.

## @fallbacks

Supported by Fela, Glamor, JSS, and TypeStyle.

```javascript
{
  wrapper: {
    // ...
    background: 'linear-gradient(...)',
    display: 'flex',
    '@fallbacks': {
      background: 'red',
      display: ['box', 'flex-box'],
    },
  },
}
```

> Aphrodite does not support fallback styles.

> Fela requires the `fela-plugin-fallback-value` plugin.

## @media

Supported by all adapters.

```javascript
tooltip: {
  // ...
  maxWidth: 300,
  '@media': {
    '(min-width: 400px)': {
      maxWidth: 'auto',
    },
  },
},
```

> Nested `@media` are currently not supported.

## @supports

Supported by Fela, Glamor, JSS, and TypeStyle.

```javascript
grid: {
  // ...
  float: 'left',
  '@supports': {
    '(display: flex)': {
      float: 'none',
      display: 'flex',
    },
  },
},
```

> Nested `@supports` are currently not supported.
