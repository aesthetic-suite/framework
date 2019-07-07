# 1.0.0 - 2019-07-07

#### 🎉 Release

- Initial release!

#### 💥 Breaking

- Updated `react` requirement to v16.6.
- Updated `withStyles` HOC to receive the CSS transformer function as a `cx` prop.
- Updated `withStyles` and `withTheme` HOCs to internally use function components with hooks instead
  of class components.
- **[TS]** Renamed the `WithStylesProps` interface to `WithStylesWrappedProps`.
- **[TS]** Renamed the `WithThemeProps` interface to `WithThemeWrappedProps`.

#### 🚀 Updates

- Added a `cxPropName` option to `withStyles`.
- Added `DirectionContext` and `DirectionProvider` to support RTL.
- Added `ThemeContext` and `ThemeProvider` to support regional themes.
- Updated `useStyles` and `withStyles` to support RTL.

#### 🛠 Internals

- Moved some `@types` dependencies to development only.
- Updated some `@types` dependencies to use `*` version.
- Updated `useStyles` and `withStyles` to consume `DirectionProvider` and `ThemeProvider`.
- Updated `useTheme` and `withTheme` to consume `ThemeProvider`.
