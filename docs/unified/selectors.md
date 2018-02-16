# Selectors

Selectors can be defined inside a style declaration. Multiple selectors can also be defined
by passing a comma separated list.

## Attributes

```javascript
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

```javascript
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

## Descendants

```javascript
{
  list: {
    // ...
    '> li': {
      listStyle: 'none',
      padding: 5,
    },
  },
}
```

> Only direct descendants are allowed.
