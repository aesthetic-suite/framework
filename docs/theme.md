# Using Themes

Before we can start styling our components, we must register a theme using
`Aesthetic#registerTheme`. This method accepts a theme name, a theme object, and an optional
[global stylesheet](./unified/global-at.md) function.

Theme objects are simply plain objects that define reusable constants, like font sizes, font
families, color ranges, spacing, patterns, utilities, and more. The theme object structure _must be
exactly the same_ across all themes, otherwise styled components would break.

```ts
interface Theme {
  color: {
    bg: string;
    forest: string[]; // Shades of green
    lava: string[]; // Shades of red
    ocean: string[]; // Shades of blue
  };
  fontFamily: string;
  fontSizes: {
    small: number;
    normal: number;
    large: number;
  };
  unit: number;
}
```

The interface above representing a theme object defines a set of colors, a single font family, 3
variant font sizes, and a standard spacing unit. The interface and associated global styles can then
be registered like so.

```ts
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

> When using TypeScript, the theme type must have an exact structure (no mapped or indexed objects),
> and must be passed as a generic: `new Aesthetic<Theme>()`.

### Extending Themes

If you'd like to extend a base theme to create a new theme, use `Aesthetic#extendTheme`. This method
accepts the new theme name as the 1st argument, the theme name to inherit from as the 2nd argument,
and the remaining arguments matching `Aesthetic#registerTheme`.

```ts
aesthetic.extendTheme('darker', 'dark', {
  color: {
    bg: 'black',
  },
});
```

> Extending themes will deep merge the two objects.

### Enabling A Theme

A theme can be enabled by defining the `theme` option on the `Aesthetic` instance. Only 1 theme can
be active at a time.

```ts
const aesthetic = new AphroditeAesthetic<Theme>(extensions, {
  theme: 'dark',
});
```

### Accessing Theme In Components

There are 2 ways to access the currently enabled theme in a component. The first is with the aptly
named `withTheme` HOC, which passes the theme object as a prop. The HOC supports the following
options.

- `pure` (boolean) - Render a pure component instead of a regular component. _Can be declared
  globally on the Aesthetic instance._
- `themePropName` (string) - Name of the prop in which to pass the theme object to the wrapped
  component. Defaults to `theme`. _Can be declared globally on the Aesthetic instance._

```tsx
import React from 'react';
import withTheme, { WithThemeProps } from './withTheme';
import cx from './cx';

export interface Props {
  children: NonNullable<React.ReactNode>;
}

function Component({ children, theme }: Props & WithThemeProps) {
  return <div className={cx({ spacing: theme.unit })}>{children}</div>;
}

export default withTheme()(Component);
```

The second form of access is with the `withStyles` HOC. When the `passThemeProp` option is enabled,
the current theme object is passed as a prop. The HOC supports the same options as `withTheme`.

```tsx
import React from 'react';
import withStyles, { WithStylesProps } from './withStyles';
import cx from './cx';

export interface Props {
  children: NonNullable<React.ReactNode>;
}

function Component({ children, styles, theme }: Props & WithStylesProps) {
  return <div className={cx(styles.wrapper, { spacing: theme!.unit })}>{children}</div>;
}

export default withStyles(
  () => ({
    wrapper: {
      display: 'block',
    },
  }),
  {
    passThemeProp: true,
  },
)(Component);
```

More information on `withStyles` can be found in the [styling components documentation](./style.md).

> When using TypeScript, the `theme` property for `WithStylesProps` is marked as optional, since the
> functionality is opt-in. Using `!` is required here.

### Tips & Guidelines

- Dont use names like "red", "green", etc
- Use shades for colors
- Theme object should be exactly the same between themes
- Dark mode color shades are reversed
