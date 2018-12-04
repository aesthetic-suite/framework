# Global At-rules

Global at-rules must be defined as global styles when registering a theme.

| Adapter   | @charset | @font-face | @global | @import | @keyframes | @page | @viewport |
| :-------- | :------: | :--------: | :-----: | :-----: | :--------: | :---: | :-------: |
| Aphrodite |          |     ✓      |    ✓    |         |     ✓      |       |           |
| Fela      |          |     ✓      |    ✓    |         |     ✓      |       |           |
| JSS       |    ✓     |     ✓      |   ✓¹    |    ✓    |     ✓      |       |     ✓     |
| TypeStyle |          |     ✓      |    ✓    |         |     ✓      |       |           |

> 1. Requires a plugin.

## @charset

Set the document character set.

```javascript
{
  '@charset': 'utf8',
}
```

## @font-face

Define a font face to be referenced with the `fontFamily` property. The at-rule requires an object,
with the font family name as the key, and the font face(s) as the value. Each font face requires an
array of `srcPaths`.

```javascript
{
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
    },
  },
}
```

To support multiple font variations, like bold and italics, pass an array of font faces.

```javascript
{
  '@font-face': {
    'Open Sans': [
      {
        fontStyle: 'normal',
        fontWeight: 'normal',
        srcPaths: ['fonts/OpenSans.woff2', 'fonts/OpenSans.ttf'],
      },
      {
        fontStyle: 'italic',
        fontWeight: 'normal',
        srcPaths: ['fonts/OpenSans-Italic.woff2', 'fonts/OpenSans-Italic.ttf'],
      },
      {
        fontStyle: 'normal',
        fontWeight: 'bold',
        srcPaths: ['fonts/OpenSans-Bold.woff2', 'fonts/OpenSans-Bold.ttf'],
      },
    ],
  },
}
```

To define `local()` source aliases, pass an array of strings to a `local` property.

```javascript
{
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      local: ['OpenSans', 'Open-Sans'],
      srcPaths: ['fonts/OpenSans.ttf'],
    },
  },
}
```

> The `fontFamily` property can be omitted as it'll be inherited from the at-rule key.

## @global

Define global rulesets to be applied to the entire document.

```javascript
{
  '@global': {
    body: {
      margin: 0,
      padding: 0,
      fontSize: 16,
    },
    'body, html': {
      height: '100%',
    },
    a: {
      color: 'red',
      ':hover': {
        color: 'darkred',
      },
    },
  },
}
```

> JSS requires the `jss-global` plugin.

## @import

Define one or many CSS files to import.

```javascript
{
  // Single
  '@import': 'css/reset.css',
  // Multiple
  '@import': ['css/reset.css', 'css/global.css'],
}
```

## @keyframes

Define an animation keyframe to be referenced with the `animationName` property. The at-rule
requires an object, with the animation name name as the key, and the keyframe as the value.

```javascript
{
  '@keyframes': {
    fade: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  },
}
```

## @page

Define a ruleset to be applied when the document is printed.

```javascript
{
  '@page': {
    margin: '1cm',

    ':left': {
      margin: 0,
    },
  },
}
```

## @viewport

Define a ruleset that dictates how the viewport functions.

```javascript
{
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
}
```
