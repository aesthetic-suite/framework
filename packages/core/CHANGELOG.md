# 3.1.0 - 2019-02-09

#### 🚀 New

- Added ECMAScript module support via `esm/` built files.
- Removed copyright docblocks from source files to reduce bundle size.

# 3.0.1 - 2019-01-31

#### 🐞 Fixed

- Fixed an issue in which global styles weren't flushing for some adapters.

# 3.0.0 - 2019-01-28

Aesthetic has been rewritten in TypeScript, and as such, many existing patterns were not type safe
and had to be refactored. With this rewrite comes a new adapter layer, easier theme layer, removal
of stylers, and unified syntax as the default.

[View the migration guide!](https://github.com/milesj/aesthetic/blob/master/docs/migrate/3.0.md)

#### 💥 Breaking

**Core**

- Dropped support for Glamor and the `aesthetic-adapter-glamor` package.
- Dropped support for style objects passed directly to `withStyles`. Styles must now be a definition
  function that returns an object.
- Dropped support for current props passed as the 2nd argument to the `withStyles` styling function.
  This pattern was non-deterministic and caused cache invalidation issues.
- Removed the `Adapter` class. Adapters now extend `Aesthetic` instead of being passed to it through
  the constructor.
  - `Adapter#create` is now `Aesthetic#processStyleSheet`.
  - `Adapter#transform` is now `Aesthetic#transformToClassName`.
  - `Adapter#merge` has been removed, and now relies on
    [extend](https://github.com/justmoon/node-extend).
- Removed the `Aesthetic` option `defaultTheme`, use `theme` option instead.
- Removed the `ThemeProvider` component, use `theme` option instead.
- Removed the `createStyler` factory function.
  - Use `Aesthetic#withStyles` instead of `style`.
  - Use `Aesthetic#transformStyles` instead of `transform`.
- Removed the `withStyles` option `styleName`. Names are now generated with a unique ID.
- Removed the `withStyles` option `passThemeNameProp`. Access the current theme from `Aesthetic`
  options.
- Removed `createStyleElement` helper function.
- Removed `PropType`s exported from the index.
- Updated the `Aesthetic` option `pure` to be enabled by default.
- Updated `Aesthetic#registerTheme` and `Aesthetic#extendTheme` global styles to require a
  definition function that returns an object.
- Moved `Aesthetic#constructor` options to the 1st argument.
- Moved `Aesthetic#extendTheme` theme name to 1st argument, and parent theme name to 2nd argument
  (swapped positions).

**Unified Syntax**

- Unified syntax is now required and is the default syntax. Native adapter syntax is no longer
  supported.
- Dropped support for `@namespace` (was rarely supported by adapters).
- Dropped support for global at-rules being defined within a component stylesheet (via
  `withStyles`). This includes `@charset`, `@import`, `@font-face`, `@global`, `@keyframes`,
  `@page`, and `@viewport`.
  - They must only be defined within the global stylesheet when registering a theme.
  - Local `@keyframes` can be defined within a component by setting the keyframes object to
    `animationName`.
  - Local `@font-face` can be defined within a component by setting the font face object to
    `fontFamily`.
- Dropped support for local at-rules being defined within a global stylesheet (via theme global
  styles). This includes `@fallbacks`, `@media`, `@supports`, and `@selectors`.
- Child combinators (`> li`), advanced pseudos (`:not(:nth-child(n))`), and advanced attributes
  (`[href*="foo"]`) must now be defined within the `@selectors` at-rule.

#### 🚀 New

**Core**

- Added `Aesthetic` option `theme` to denote the currently active theme.
- Added `Aesthetic#withTheme` HOC factory to gain access to the active theme object.
- DOM styles are now flushed on mount to properly support server-side rendering.
- Global styles now have access to the current theme object.

**Unified Syntax**

- Added new `@selectors` at-rule to support all advanced selectors.
- Updated `@page` to support `:left` and `:right` pseudos.
- Updated `animationName` property to support inline keyframes objects.
- Updated `fontFamily` property to support inline font face objects.
- Properly supports nested at-rules, like `@media` and `@supports`.

#### 🐞 Fixed

- Global theme styles will no longer collide with other themes.

#### 🛠 Internal

- Converted from Flow to TypeScript.

# 2.6.0 - 2018-07-11

#### 🚀 New

- Unified Syntax
  - Updated `@import` to support an array of paths.

# 2.5.0 - 2018-05-30

#### 🚀 New

- Added an `Adapter#merge` method.

# 2.4.1 - 2018-05-09

#### 🐞 Fixed

- Fixed a bug in which `themeName` was being passed from the HOC.

# 2.4.0 - 2018-05-08

#### 🚀 New

- Added new `passThemeProp` and `passThemeNameProp` options to control which props are passed to the
  underlying component.

#### 🐞 Fixed

- Fixed a bug in which a component's `defaultProps` were not being passed to the styler function.

# 2.3.1 - 2018-04-19

#### 🐞 Fixed

- Moved initial style transformation to the constructor to avoid possible race conditions.

# 2.3.0 - 2018-04-17

#### 🚀 New

- Added a `wrappedRef` prop to access the underlying wrapped component.

#### 🐞 Fixed

- Fixed an issue in which styles would transform infinitely on update.

# 2.2.4 - 2018-04-16

#### 🐞 Fixed

- Updated `componentWillMount` to `componentDidMount` and `componentWillReceiveProps` to
  `componentDidUpdate` in preparation for React 16.3.

# 2.2.3 - 2018-03-20

#### 🐞 Fixed

- Fixed incorrectly built and published files.

# 2.2.2 - 2018-03-20

#### 🐞 Fixed

- Fixed a bug where generated class names would start with an invalid number.

# 2.2.1 - 2018-01-30

#### 🐞 Fixed

- Unified Syntax
  - Font face `srcPaths` will now work with query strings.

# 2.2.0 - 2018-01-13

#### 🚀 New

- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

# 2.1.0 - 2018-01-03

#### 🚀 New

- Style names (usually the component name) are now passed to adapters during the stylesheet creation
  phase.

# 2.0.0 - 2018-01-02

Aesthetic has been rewritten to properly support specificity, new at-rules, and global styles.
Styles are no longer transformed on mount and will now be transformed on render using a new
stylesheet layer. Furthermore, unified syntax now supports most common at-rules, and a new
`@font-face` structure.

[View the migration guide!](https://github.com/milesj/aesthetic/blob/master/docs/migrate/2.0.md)

#### 💥 Breaking

- Requires IE 11+.
- Requires `WeakMap` support.
- Removed React Native support (it was finicky and only supported by 1 adapter).
- Removed `aesthetic-utils` package (any remaining helpers were moved to core).
- Removed the `classes` function.
  - Use the `transform` function provided by `createStyler` instead.
- Removed `ClassNamesPropType` and `ClassOrStylesPropType` prop types.
  - Use the `StylesPropType` instead.
- Refactored `Aesthetic#transformStyles` and `Adapter#transform` to now require an array of style
  declarations.
  - Will now return a single combined class name for increased specificity.
- Refactored `createStyler` to return 2 functions, `style` and `transform`.
  - The `style` function is an HOC factory and works like the original 1.0 return value.
  - The `transform` function is now required to generate class names from style declarations.
- Renamed the HOC `wrappedComponent` static property to `WrappedComponent`.
- Renamed the HOC `theme` prop (to toggle themes) to `themeName`.
- Inherited and parent styles are no longer passed as the HOC styler callback 2nd argument.
- Unified Syntax
  - The `@font-face` unified syntax rule has been rewritten to support multiple variations of the
    same font family.
    - The object key is now the font family name, instead of a random name.
    - The object value can now be an array of font face style declarations.
    - The `srcPaths` property, an array of paths, is now required (instead of `src`).

#### 🚀 New

- Added a new adapter, `TypeStyle`.
- Added `Aesthetic#createStyleSheet` for converting a component's styles into an adapter specific
  stylesheet.
  - The component's current props are passed as the 2nd argument to the HOC styler callback.
  - Inherited and parent styles are now automatically deep merged when extending.
- Added `Adapter#create` for creating and adapting stylesheets.
- Updated `Aesthetic#registerTheme` to use the new global styles system.
- The current theme declarations will be passed to styled components under the `theme` prop.
  - The previous `theme` prop was renamed to `themeName`.
  - The `Aesthetic` `themePropName` option now controls this new prop.
- Unified Syntax
  - Added new `@charset`, `@global`, `@import`, `@namespace`, `@page`, `@supports`, and `@viewport`
    at-rules (varies between adapters).
  - Added a new property `local` for use within `@font-face` (the source `local()` value).

#### 🛠 Internal

- Rewritten Flowtype definitions.

# 1.7.1 - 2017-11-10

#### 🛠 Internal

- Tested against React 16.1.
- Improved build process.

# 1.7.0 - 2017-10-18

#### 🚀 New

- Added a `defaultTheme` option to `Aesthetic`, which is used when `themeName` is empty.
- Added a `pure` option to `Aesthetic`, which forces components to extend `React.PureComponent`.

#### 🛠 Internal

- Enabled Yarn workspaces.
- Updated Flowtype definitions.

# 1.6.0 - 2017-09-27

#### 🚀 New

- Added support for `react` 16.0.
- Updated `prop-types` to 15.6.

#### 🛠 Internal

- Updated Flowtype definitions.
- Updated cross package imports to use CommonJS paths.
- Improved the build process.

# 1.5.0 - 2017-07-28

- Updated `hoist-non-react-statics` to 2.2.
- Updated Flow definitions.
- Wrapped errors in `__DEV__` environment checks.

# 1.4.2 - 2017-06-19

- Fixed an issue with the Lerna package.

# 1.4.1 - 2017-06-19

- Updated `react` to 15.6.
- Updated `prop-types` to 15.5.10.

# 1.4.0 - 2017-05-11

- Updated IE requirement to 11+.
- Updated to include src/ files in the published package.

# 1.3.0 - 2017-04-24

- Updated to support React 15.5 and the new `prop-types` package.
