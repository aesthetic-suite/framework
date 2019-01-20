# Setup

To make use of Aesthetic, we must instantiate an [adapter](./adapters/README.md). The adapter
requires a native library instance as the 1st argument, and an optional Aesthetic options object as
the 2nd argument. Please refer to each adapter for explicit usage.

```ts
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';

const aesthetic = new AphroditeAesthetic(extensions, {
  pure: true,
  theme: 'dark',
});
```

The following options are available:

- `extendable` (boolean) - Can component styles be extended by other components? Otherwise, the
  styles are locked and isolated. Defaults to `false`. _Can be customized per component._
- `passThemeProp` (boolean) - Should the theme prop be passed to all wrapped components? Defaults to
  `false`. _Can be customized per component._
- `pure` (boolean) - Should all HOC wrapped components use `React.PureComponent`? Defaults to
  `true`. _Can be customized per component._
- `stylesPropName` (string) - The name of the styles prop passed to wrapped components. Defaults to
  `styles`.
- `theme` (string) - The currently active theme. Defaults to `default`.
- `themePropName` (string) - The name of the theme prop passed to wrapped components. Defaults to
  `theme`.

## Registering themes

Before we can start styling our components, we must register a theme using
`Aesthetic#registerTheme`. This method accepts a theme name, an object of parameters (a theme
object), and an optional [global stylesheet](./unified/global-at.md) function.

Themes are simply objects that define reusable constants, like font sizes, font families, colors,
spacing, and more. [View the theme guide for helpful tips on properly writing themes](./theme.md).

```ts
interface Theme {
  color: {
    bg: string;
    forest: string[]; // Shades of green
    lava: string[]; // Shades of red
    water: string[]; // Shades of blue
  };
  fontFamily: string;
  fontSizes: {
    small: number;
    normal: number;
    large: number;
  };
  unit: number;
}

const aesthetic = new AphroditeAesthetic<Theme>();

aesthetic.registerTheme(
  'dark',
  {
    color: {
      bg: 'darkgray',
      forest,
      lava,
      water,
    },
    fontFamily: 'Roboto',
    fontSizes: {
      small: 14,
      normal: 16,
      large: 18,
    },
    unit: 8,
  },
  theme => ({
    '@global': {
      body: {
        margin: 0,
        padding: 0,
        height: '100%',
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSizes.normal,
      },
    },
    '@font-face': {
      [theme.fontFamily]: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        srcPaths: ['fonts/Roboto.woff2'],
      },
    },
  }),
);
```

> For full TypeScript support, the theme type must have an exact structure, and must be passed as an
> Aesthetic generic.

If you'd like to extend a base theme to create a new theme, use `Aesthetic#extendTheme`. This method
accepts the new theme name as the 1st argument, the theme name to inherit from as the 2nd argument,
and the remaining arguments matching `Aesthetic#registerTheme`.

```javascript
aesthetic.extendTheme('darker', 'dark', {
  color: {
    bg: 'black',
  },
});
```

> Extending themes will deep merge the two parameter objects.

## Creating helper functions

All of Aesthetic's functionality, including HOCs and hooks, are utilized through a class instance,
which can be quite cumbersome to use. It's suggested to wrap this functionality in reusablity helper
functions.

The [Aesthetic#withStyles](./with-styles.md) HOC can be written as the following. If using
TypeScript, all adapters export a `ParsedBlock` type that must be passed to the `WithStylesProps`
type.

```ts
// withStyles.ts
import {
  StyleSheetDefinition,
  WithStylesOptions,
  WithStylesProps as BaseWithStylesProps,
} from 'aesthetic';
import { ParsedBlock } from 'aesthetic-adapter-aphrodite';
import aesthetic, { Theme } from './aesthetic/instance';

export type WithStylesProps = BaseWithStylesProps<Theme, ParsedBlock>;

export default function withStyles(
  styleSheet: StyleSheetDefinition<Theme>,
  options: WithStylesOptions = {},
) /* infer */ {
  return aesthetic.withStyles(styleSheet, options);
}
```

The [Aesthetic#withTheme](./with-theme.md) HOC can be written as the following.

```ts
// withTheme.ts
import { WithThemeOptions, WithThemeProps as BaseWithThemeProps } from 'aesthetic';
import aesthetic, { Theme } from './aesthetic/instance';

export type WithThemeProps = BaseWithThemeProps<Theme>;

export default function withTheme(options: WithThemeOptions = {}) /* infer */ {
  return aesthetic.withTheme(options);
}
```

And lastly, the `Aesthetic#transformStyles` method, which is required to transform styles into CSS
class names, can be written as the following. If using TypeScript, the `NativeBlock` and
`ParsedBlock` adapter types must be used for proper type safety.

```ts
// css.ts
import { NativeBlock, ParsedBlock } from 'aesthetic-adapter-aphrodite';
import aesthetic from './aesthetic/instance';

export default function css(
  ...styles: (undefined | false | string | NativeBlock | ParsedBlock)[]
): string {
  return aesthetic.transformStyles(...styles);
}
```

## Bundler integration

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
