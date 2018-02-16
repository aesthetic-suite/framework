# Global At-rules

Not to be confused with global styles, global at-rules are at-rules that must be defined in the
root of a style sheet and cannot be defined within a selector.

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
  button: {
    // ...
    fontFamily: 'Open Sans',
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

Supported by Aphrodite, Fela, JSS, and TypeStyle.

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
  button: {
    // ...
    animationName: 'fade',
    animationDuration: '3s',
  },
}
```

## @namespace

Supported by JSS.

```javascript
{
  '@namespace': 'url(http://www.w3.org/1999/xhtml)',
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
