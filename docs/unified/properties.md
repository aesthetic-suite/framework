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
