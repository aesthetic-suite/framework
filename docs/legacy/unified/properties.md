# Properties

Standard structure for defining ruleset properties.

- Camel case property names (including vendor prefixes).
- Units that default to `px` can be written as literal numbers.

```js
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

Inline keyframes are a compound property that can be defined by passing an object, or an array of
objects to `animationName`.

```js
{
  // Single animation
  single: {
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
      name: 'fade',
    },
  },

  // Multiple animations
  multiple: {
    animationName: [
      'slide', // Reference a global keyframe
      {
        from: { opacity: 0 },
        to: { opacity: 1 },
        name: 'fade',
      },
      {
        '0%': { },
        '100%': { },
        name: 'bounce',
      },
    ],
  },
}
```

> An optional `name` property can be used to customize the animation name.

## Fonts

Inline font faces are a compound property that can be defined by passing an object, or an array of
objects to `fontFamily`.

```js
{
  // Single font
  single: {
    fontFamily: {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  },

  // Multiple fonts
  multiple: {
    fontFamily: [
      'Roboto', // Reference a global font
      {
        fontFamily: 'Open Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
      },
      {
        fontFamily: 'Open Sans',
        fontStyle: 'normal',
        fontWeight: 800,
        srcPaths: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
      },
    ],
  },
}
```
