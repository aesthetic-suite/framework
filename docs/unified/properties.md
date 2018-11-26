# Properties

Standard structure for defining properties.

- Camel case property names (including vendor prefixes).
- Units can be written as literal numbers.

```javascript
{
  button: {
    margin: 0,
    padding: 5,
    display: 'inline-block',
    lineHeight: 'normal',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#ccc',
    color: '#000',
  },
}
```

> Fela requires the `fela-plugin-unit` plugin.

> JSS requires the `jss-default-unit`, `jss-camel-case`, and `jss-global` plugins.

## Animations

Inline keyframes can be defined by passing an object, or an array of objects to `animationName`.

```javascript
{
  element: {
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      name: 'fade',
    },
  },
}
```

> An optional `name` property can be used to customize the animation name.
