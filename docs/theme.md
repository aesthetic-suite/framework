# Theming Components

Themes are great in that they enable components to be styled in different ways based
on pre-defined style guide parameters, like font size, color hex codes, and more.

To make use of a theme, register it through the `Aesthetic` instance using `registerTheme`.
This method accepts a name, an object of parameters, and an optional
[style object](./style.md#style-objects) used for globals (like font faces and animation keyframes).

```javascript
aesthetic.registerTheme('dark', {
  unit: 'em',
  unitSize: 8,
  spacing: 5,
  font: 'Open Sans',
  bgColor: 'darkgray',
}, {
  '@global': {
    body: {
      margin: 0,
      padding: 0,
      height: '100%',  
    },
  },
  '@font-face': {
    'Open Sans': {
      fontStyle: 'normal',
      fontWeight: 'normal',
      srcPaths: ['fonts/OpenSans.woff'],
    },
  },
});
```

> Global styles are immediately compiled and attached to the DOM. Be wary of conflicts.

If you'd like to extend a base theme to create a new theme, use `extendTheme`. This
method accepts the theme name to inherit from as the first argument, with the remaining
arguments matching `registerTheme`.

```javascript
aesthetic.extendTheme('dark', 'darker', {
  bgColor: 'black',
});
```

> Extending themes will deep merge the two parameter objects.

## Using Theme Styles

Once a theme has been registered, we can access the theme parameters by using a
[style function](./style.md#style-functions). The parameters object is passed as the 1st
argument to the function.

```javascript
withStyles(theme => ({
  button: {
    fontSize: `${theme.unitSize}${theme.unit}`,
    fontFamily: theme.font,
    padding: theme.spacing,
  },
}))(Component);
```

The theme style declaration and theme name can be accessed within the underlying component via the `theme` prop and `themeName` prop respectively. This functionality can be toggled with the `passThemeProp` and `passThemeNameProp` options.

## Activating Themes

To activate and inform components to use a specific theme, we must use the `ThemeProvider`,
which accepts a `name` of the theme.

```javascript
import { ThemeProvider } from 'aesthetic';

<ThemeProvider name="default">
  // All components within here will use the "default" theme

  <ThemeProvider name="dark">
    // And all components here will use the "dark" theme
  </ThemeProvider>
</ThemeProvider>
```

Or by passing a `themeName` prop to an individual component.

```javascript
<Button themeName="dark">Save</Button>
```

Or by setting the default theme on the `Aesthetic` instance.

```javascript
new Aesthetic(adapter, { defaultTheme: 'default' });
```
