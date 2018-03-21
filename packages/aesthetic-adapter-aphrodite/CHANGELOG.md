# 2.2.0 - 03/20/18
#### 🚀 New
* Updated `aphrodite` to 2.1.

# 2.1.0 - 01/13/18
#### 🚀 New
* Can now pass dynamic style objects to `transform` (will be akin to inline).
* Unified Syntax
  * Attribute selectors are now supported when starting with `[`.
  * Direct descendant selectors are now supported with `>`.
  * Multiple selectors are now supported by separating each selector with a comma.

# 2.0.0 - 01/02/18
#### 💥 Breaking
* Rewritten to support the [core 2.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
* Constructor 1st argument now requires an array of extensions instead of an Aphrodite `StyleSheet`.

#### 🚀 New
* Supports global styles based on the [official Aphrodite extension example](https://github.com/Khan/aphrodite#creating-extensions).
  * Styles must be nested within a `globals` object.
  * Selectors must be prefixed with a `*`.
* Unified Syntax
  * Adds new `@global` at-rule.
  * Supports the new `@font-face` structure.

#### 🛠 Internal
* Rewritten Flowtype definitions.

# 1.6.2 - 11/10/17
#### 🛠 Internal
* Tested against React 16.1.
* Improved build process.

# 1.6.1 - 10/18/17
#### 🛠 Internal
* Enabled Yarn workspaces.
* Updated Flowtype definitions.

# 1.6.0 - 9/27/17
#### 🚀 New
* Added support for `react` 16.0.
* Updated `prop-types` to 15.6.

#### 🛠 Internal
* Updated cross package imports to use CommonJS paths.
* Improved the build process.

# 1.5.0 - 7/28/17
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
