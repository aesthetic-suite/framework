# 2.6.0 - 07/11/18

#### 🚀 New

- Unified Syntax
  - Updated `@import` to support an array of paths.

# 2.5.0 - 05/30/18

#### 🚀 New

- Added an `Adapter#merge` method.

# 2.4.1 - 05/09/18

#### 🐞 Fixed

- Fixed a bug in which `themeName` was being passed from the HOC.

# 2.4.0 - 05/08/18

#### 🚀 New

- Added new `passThemeProp` and `passThemeNameProp` options to control which props are passed to the
  underlying component.

#### 🐞 Fixed

- Fixed a bug in which a component's `defaultProps` were not being passed to the styler function.

# 2.3.1 - 04/19/18

#### 🐞 Fixed

- Moved initial style transformation to the constructor to avoid possible race conditions.

# 2.3.0 - 04/17/18

#### 🚀 New

- Added a `wrappedRef` prop to access the underlying wrapped component.

#### 🐞 Fixed

- Fixed an issue in which styles would transform infinitely on update.

# 2.2.4 - 04/16/18

#### 🐞 Fixed

- Updated `componentWillMount` to `componentDidMount` and `componentWillReceiveProps` to
  `componentDidUpdate` in preparation for React 16.3.

# 2.2.3 - 03/20/18

#### 🐞 Fixed

- Fixed incorrectly built and published files.

# 2.2.2 - 03/20/18

#### 🐞 Fixed

- Fixed a bug where generated class names would start with an invalid number.

# 2.2.1 - 01/30/18

#### 🐞 Fixed

- Unified Syntax
  - Font face `srcPaths` will now work with query strings.

# 2.2.0 - 01/13/18

#### 🚀 New

- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

# 2.1.0 - 01/03/18

#### 🚀 New

- Style names (usually the component name) are now passed to adapters during the stylesheet creation
  phase.

# 2.0.0 - 01/02/18

Aesthetic has been rewritten to properly support specificity, new at-rules, and global styles.
Styles are no longer transformed on mount and will now be transformed on render using a new
stylesheet layer. Furthermore, unified syntax now supports most common at-rules, and a new
`@font-face` structure.

[View the migration guide!](../../MIGRATE_2.0.md)

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

# 1.7.1 - 11/10/17

#### 🛠 Internal

- Tested against React 16.1.
- Improved build process.

# 1.7.0 - 10/18/17

#### 🚀 New

- Added a `defaultTheme` option to `Aesthetic`, which is used when `themeName` is empty.
- Added a `pure` option to `Aesthetic`, which forces components to extend `React.PureComponent`.

#### 🛠 Internal

- Enabled Yarn workspaces.
- Updated Flowtype definitions.

# 1.6.0 - 9/27/17

#### 🚀 New

- Added support for `react` 16.0.
- Updated `prop-types` to 15.6.

#### 🛠 Internal

- Updated Flowtype definitions.
- Updated cross package imports to use CommonJS paths.
- Improved the build process.

# 1.5.0 - 7/28/17

- Updated `hoist-non-react-statics` to 2.2.
- Updated Flow definitions.
- Wrapped errors in `__DEV__` environment checks.

# 1.4.2 - 6/19/17

- Fixed an issue with the Lerna package.

# 1.4.1 - 6/19/17

- Updated `react` to 15.6.
- Updated `prop-types` to 15.5.10.

# 1.4.0 - 5/11/17

- Updated IE requirement to 11+.
- Updated to include src/ files in the published package.

# 1.3.0 - 4/24/17

- Updated to support React 15.5 and the new `prop-types` package.
