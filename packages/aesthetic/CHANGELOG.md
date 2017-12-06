# 2.0.0
#### 💥 Breaking
* The `@font-face` unified syntax rule has been rewritten to support multiple variations of the
  same font family.
  * The object key is now the font family name, instead of a random name.
  * The object value can now be an array of font face style declarations.
  * The `src` property must now be an array of paths (the `format()` is automatically added).
* The HOC `wrappedComponent` static property was renamed to `WrappedComponent`.
* The HOC `theme` prop (to toggle themes) was renamed to `themeName`.

#### 🚀 New
* Added support for a new `localAlias` property (the `@font-face local()` value).
* The current theme style declaration will be passed to styled components under the `theme` prop.
  * The previous `theme` prop was renamed to `themeName`.
  * The `Aesthetic` `themePropName` option now controls this new prop.
* Wrapping parens in single clause `@media` queries can now be omitted.

#### 🛠 Internal
* Rewritten Flowtype definitions.

# 1.7.1 - 11/10/17
#### 🛠 Internal
* Tested against React 16.1.
* Improved build process.

# 1.7.0 - 10/18/17
#### 🚀 New
* Added a `defaultTheme` option to `Aesthetic`, which is used when `themeName` is empty.
* Added a `pure` option to `Aesthetic`, which forces components to extend `React.PureComponent`.

#### 🛠 Internal
* Enabled Yarn workspaces.
* Updated Flowtype definitions.

# 1.6.0 - 9/27/17
#### 🚀 New
* Added support for `react` 16.0.
* Updated `prop-types` to 15.6.

#### 🛠 Internal
* Updated Flowtype definitions.
* Updated cross package imports to use CommonJS paths.
* Improved the build process.

# 1.5.0 - 7/28/17
* Updated `hoist-non-react-statics` to 2.2.
* Updated Flow definitions.
* Wrapped errors in `__DEV__` environment checks.

# 1.4.2 - 6/19/17
* Fixed an issue with the Lerna package.

# 1.4.1 - 6/19/17
* Updated `react` to 15.6.
* Updated `prop-types` to 15.5.10.

# 1.4.0 - 5/11/17
* Updated IE requirement to 11+.
* Updated to include src/ files in the published package.

# 1.3.0 - 4/24/17
* Updated to support React 15.5 and the new `prop-types` package.
