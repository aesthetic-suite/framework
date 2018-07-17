# Initial Setup

Aesthetic makes heavy use of `process.env.NODE_ENV` for logging errors in development. These errors
will be entirely removed in production if the following build steps are configured.

## Webpack

[DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) plugin is required
when using Webpack.

```javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
}),
```

## Browserify

[Envify](https://github.com/hughsk/envify) transformer is required when using Browserify.

```javascript
envify({
  NODE_ENV: process.env.NODE_ENV || 'production',
});
```
