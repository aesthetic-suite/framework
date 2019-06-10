# 1.0.0

#### 🎉 Release

- Initial release!

#### 💥 Breaking

- Updated `react` requirement to v16.6.
- **[TS]** Renamed the `WithStylesProps` interface to `WithStylesWrappedProps`.
- **[TS]** Renamed the `WithThemeProps` interface to `WithThemeWrappedProps`.

#### 🚀 Updates

- Added a `cxPropName` option to `withStyles`.
- Added `DirectionContext` and `DirectionProvider` to support RTL.
- Added `ThemeContext` and `ThemeProvider` to dynamically change themes.
- Updated `useStyles` and `withStyles` to support RTL.
- Updated `withStyles` HOC to receive the CSS transformer function as a `cx` prop.

#### 🛠 Internals

- Moved some `@types` dependencies to development only.
- Updated some `@types` dependencies to use `*` version.
