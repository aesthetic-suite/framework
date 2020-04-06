## 2.2.0 - 2020-04-06

#### 🚀 Updates

- `useStyles` will now cache the style sheet to reduce `createStyleSheet` calls.

## 2.1.0 - 2020-01-26

#### 🚀 Updates

- Migrated to Rollup for a smaller filesize.

#### 📦 Dependencies

- Updated all to latest.
- Fixed `aesthetic` peer dependency pointing to the wrong version.

### 2.0.1 - 2019-12-19

#### ⚙️ Types

- Fixed an issue with neverization where deeply nested objects cannot be typed correctly, and would
  error with "Type instantiation is excessively deep and possibly infinite.".

# 2.0.0 - 2019-12-19

#### 💥 Breaking

- Rewritten to support the
  [core 5.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Hooks and HOCs are no longer factories and can be used as-is when imported.
  - `useStylesFactory` -> `useStyles`
  - `useThemeFactory` -> `useTheme`
  - `withStylesFactory` -> `withStyles`
  - `withThemeFactory` -> `withTheme`
- Removed the `aesthetic` prop from `DirectionProvider` and `ThemeProvider`.
- **[TS]** The `StyledComponent` type no longer accepts a theme generic.

### 1.1.3 - 2019-09-23

#### ⚙️ Types

- Updated `React.Ref` to use `any` instead of `unknown`.

### 1.1.2 - 2019-09-15

#### 📦 Dependencies

- Updated all to latest.

#### ⚙️ Types

- Refine types and replace `any` with `unknown`.

### 1.1.1 - 2019-07-24

#### 🐞 Fixes

- **[TS]** Updated `StyledComponent` to extend from `React.memo`s `NamedExoticComponent` instead of
  `FunctionComponent`.

## 1.1.0 - 2019-07-12

#### 🚀 Updates

- Wrapped `withStyles` function component with `React.memo` for performance gains (this mimics the
  previous `pure` functionality).

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
