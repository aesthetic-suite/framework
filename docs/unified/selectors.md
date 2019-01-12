# Selectors

Selectors can be defined inside a ruleset. Multiple selectors can also be defined by passing a comma
separated list within the key.

Advanced selectors must use the [`@selectors` at-rule](./local-at.md#selectors).

## Attributes

```js
{
  button: {
    // ...
    '[disabled]': {
      opacity: 0.3,
    },
  },
}
```

## Pseudos

```js
{
  button: {
    // ...
    ':hover': {
      backgroundColor: '#eee',
    },
    '::before': {
      content: '"★"',
      display: 'inline-block',
      marginRight: 5,
    },
  },
}
```
