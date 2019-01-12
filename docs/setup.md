# Setup

To make use of Aesthetic, we must instantiate an [adapter](./adapters/README.md). This class accepts
an adapter specific library instance as the 1st argument, and an options object as the 2nd argument.

```tsx
import FelaAesthetic from 'aesthetic-adapter-fela';

// TODO
```

## Bundler Config

Aesthetic makes heavy use of `process.env.NODE_ENV` for logging errors in development. These errors
will be entirely removed in production if the following build steps are configured.

### Webpack

[DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) plugin is required
when using Webpack.

```ts
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
}),
```

### Browserify

[Envify](https://github.com/hughsk/envify) transformer is required when using Browserify.

```ts
envify({
  NODE_ENV: process.env.NODE_ENV || 'production',
});
```
