# Setup

Aesthetic is packaged and configured out of the box, and is represented by a global instance through
the default import. By default, Aesthetic will assume that CSS class names will be used for styling.
If need be, we can configure a new [adapter](./adapters/README.md) to replace this functionality.

```ts
import aesthetic from 'aesthetic';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';

aesthetic.configure({
  adapter: new AphroditeAdapter(),
  theme: 'dark',
  rtl: false,
});
```

### Options

The following options can be customized through the `Aesthetic#configure` method, most of which can
be overridden per component.

- `adapter` (Adapter) - The CSS-in-JS adapter to use for CSS styling and transformation.
- `cxPropName` (string) - Name of the prop in which to pass the styles to CSS class name transformer
  function. Defaults to `cx`.
- `extendable` (boolean) - Can component styles be extended by other components? Otherwise, the
  styles are locked and isolated. Defaults to `false`.
- `passThemeProp` (boolean) - Should the theme prop be passed to all wrapped components? Defaults to
  `false`.
- `rtl` (boolean) - Enable right-to-left mode rendering for all components.
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
