# Setup

To make use of Aesthetic, we must instantiate an [adapter](./adapters/README.md). The adapter
requires a native library instance as the 1st argument, and an optional Aesthetic options object as
the 2nd argument. Please refer to each adapter for explicit usage.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';

export default new AphroditeAesthetic(extensions, {
  pure: true,
  theme: 'dark',
});
```

The following options are available, most of which can be overridden per component.

- `extendable` (boolean) - Can component styles be extended by other components? Otherwise, the
  styles are locked and isolated. Defaults to `false`.
- `passThemeProp` (boolean) - Should the theme prop be passed to all wrapped components? Defaults to
  `false`.
- `pure` (boolean) - Should all HOC wrapped components use `React.PureComponent`? Defaults to
  `true`.
- `stylesPropName` (string) - The name of the styles prop passed to wrapped components. Defaults to
  `styles`.
- `theme` (string) - The currently active theme. Defaults to `default`.
- `themePropName` (string) - Name of the prop in which to pass the theme object to the wrapped
  component. Defaults to `theme`.

## Creating Helper Functions

All of Aesthetic's functionality, including HOCs and hooks, are utilized through a class instance,
which can be quite cumbersome to use. It's suggested to wrap this functionality in reusablity helper
functions.

### useStyles

The `Aesthetic#useStyles` hook can be written as the following.

```ts
// useStyles.ts
import { StyleSheetDefinition } from 'aesthetic';
import aesthetic, { Theme } from './aesthetic';

export default function useStyles<T>(
  styleSheet: StyleSheetDefinition<Theme, T>,
  customName?: string,
) /* infer */ {
  return aesthetic.useStyles(styleSheet, customName);
}
```

### useTheme

The `Aesthetic#useTheme` hook can be written as the following.

```ts
// useTheme.ts
import aesthetic from './aesthetic';

export default function useTheme() /* infer */ {
  return aesthetic.useTheme();
}
```

### withStyles

The `Aesthetic#withStyles` HOC can be written as the following. If using TypeScript, all adapters
export a `ParsedBlock` type that must be passed to the `WithStylesProps` type.

```ts
// withStyles.ts
import {
  StyleSheetDefinition,
  WithStylesOptions,
  WithStylesProps as BaseWithStylesProps,
} from 'aesthetic';
import { ParsedBlock } from 'aesthetic-adapter-aphrodite';
import aesthetic, { Theme } from './aesthetic';

export type WithStylesProps = BaseWithStylesProps<Theme, ParsedBlock>;

export default function withStyles<T>(
  styleSheet: StyleSheetDefinition<Theme, T>,
  options: WithStylesOptions = {},
) /* infer */ {
  return aesthetic.withStyles(styleSheet, options);
}
```

### withTheme

The `Aesthetic#withTheme` HOC can be written as the following.

```ts
// withTheme.ts
import { WithThemeOptions, WithThemeProps as BaseWithThemeProps } from 'aesthetic';
import aesthetic, { Theme } from './aesthetic';

export type WithThemeProps = BaseWithThemeProps<Theme>;

export default function withTheme(options: WithThemeOptions = {}) /* infer */ {
  return aesthetic.withTheme(options);
}
```

### transformStyles

And lastly, the `Aesthetic#transformStyles` method, which is required to transform styles into CSS
class names, can be written as the following. If using TypeScript, the `NativeBlock` and
`ParsedBlock` adapter types must be used for proper type safety.

```ts
// cx.ts
import { NativeBlock, ParsedBlock } from 'aesthetic-adapter-aphrodite';
import aesthetic from './aesthetic';

export default function cx(
  ...styles: (undefined | false | string | NativeBlock | ParsedBlock)[]
): string {
  return aesthetic.transformStyles(...styles);
}
```

> This function is returned as the 2nd value from the `useStyles` hook.

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
