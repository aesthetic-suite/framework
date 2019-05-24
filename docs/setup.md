# Setup

To make use of Aesthetic, we must instantiate an [adapter](./adapters/README.md). The adapter
requires a native adapter library instance as the 1st argument, and an optional Aesthetic options
object as the 2nd argument. Please refer to each adapter for explicit usage.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';

export default new AphroditeAesthetic(extensions, {
  pure: true,
  theme: 'dark',
});
```

### Options

The following options are available, most of which can be overridden per component.

- `cxPropName` (string) - Name of the prop in which to pass the styles to CSS class name transformer
  function. Defaults to `cx`.
- `extendable` (boolean) - Can component styles be extended by other components? Otherwise, the
  styles are locked and isolated. Defaults to `false`.
- `passThemeProp` (boolean) - Should the theme prop be passed to all wrapped components? Defaults to
  `false`.
- `pure` (boolean) - Should all HOC wrapped components use `React.PureComponent`? Defaults to
  `true`. _(React only)_
- `stylesPropName` (string) - The name of the styles prop passed to wrapped components. Defaults to
  `styles`.
- `theme` (string) - The currently active theme. Defaults to `default`.
- `themePropName` (string) - Name of the prop in which to pass the theme object to the wrapped
  component. Defaults to `theme`.

## Bundler Integration

Aesthetic makes heavy use of `process.env.NODE_ENV` for logging errors in development. These errors
will be entirely removed in production if the following build steps are configured.

### Webpack

[EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/) plugin is required when
using Webpack.

```ts
new webpack.EnvironmentPlugin(['NODE_ENV']);
```

### Browserify

[Envify](https://github.com/hughsk/envify) transformer is required when using Browserify.

```ts
envify({
  NODE_ENV: process.env.NODE_ENV || 'production',
});
```
