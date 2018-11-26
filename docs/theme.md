# Theming Components

Themes are a great pattern for enabling components to be styled in different ways based on
pre-defined style guide parameters, like font size, color hex codes, spacing, and more.

To make use of a theme, register it through `Aesthetic#registerTheme`. This method accepts a name,
an object of parameters (a theme object), and an optional
[style definition](./style.md#style-definitions) used for global styles (like font faces and
animation keyframes).

```javascript
aesthetic.registerTheme(
  'dark',
  {
    unit: 'em',
    unitSize: 8,
    spacing: 5,
    font: 'Open Sans',
    bgColor: 'darkgray',
  },
  theme => ({
    '@global': {
      body: {
        margin: 0,
        padding: 0,
        height: '100%',
        fontFamily: theme.font,
      },
    },
    '@font-face': {
      [theme.font]: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        srcPaths: ['fonts/OpenSans.woff'],
      },
    },
  }),
);
```

If you'd like to extend a base theme to create a new theme, use `Aesthetic#extendTheme`. This method
accepts the theme name to inherit from as the 2nd argument, with the remaining arguments matching
`registerTheme`.

```javascript
aesthetic.extendTheme('darker', 'dark', {
  bgColor: 'black',
});
```

> Extending themes will deep merge the two parameter objects.

## Using Theme Object

Once a theme has been registered, we can access the theme by using `withStyles`. The theme object is
passed as the 1st argument to the styles definition.

```javascript
withStyles(theme => ({
  button: {
    fontSize: `${theme.unitSize}${theme.unit}`,
    fontFamily: theme.font,
    padding: theme.spacing,
  },
}))(Component);
```

The theme object and name can be accessed within the underlying component via the `theme` and
`themeName` props respectively. This functionality can be toggled with the `passThemeProp` and
`passThemeNameProp` options.

## Activating A Theme

To activate and inform components to use a specific theme, we must set the `theme` option within
`Aesthetic`. This option defaults to "default".

```ts
new Aesthetic({ theme: 'dark' });
```
