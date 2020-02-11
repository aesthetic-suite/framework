# Selectors

Basic selectors can be defined inside a ruleset. Advanced selectors must use the
[`@selectors` at-rule](./local-at.md#selectors).

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
