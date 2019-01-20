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
