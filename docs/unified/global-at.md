# Global At-rules

Global at-rules must be defined as global styles when registering a theme.

> Not all adapters support every global at-rule.

## @charset

Supported by JSS.

```javascript
{
  '@charset': 'utf8',
}
```

## @font-face

Supported by all adapters.

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

> The `fontFamily` property can be omitted as it'll be inherited from the property name.

To support multiple font variations, like bold and italics, pass an array of declarations.

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

Lastly, to define `local()` source aliases, pass an array of strings to a `local` property.

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

## @global

Supported by all adapters.

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

Supported by JSS.

```javascript
{
  '@import': 'css/reset.css',
  // OR
  '@import': ['css/reset.css', 'css/global.css'],
}
```

## @keyframes

Supported by all adapters.

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

Currently supported by no adapters.

```javascript
{
  '@page': {
    margin: '1cm',
  },
}
```

> `:left`, `:right`, and other pseudos are not supported.

## @viewport

Supported by JSS.

```javascript
{
  '@viewport': {
    width: 'device-width',
    orientation: 'landscape',
  },
}
```
