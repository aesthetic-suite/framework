# 3.0.0

#### 💥 Breaking

- Rewritten to support the
  [core 3.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Refactored `JSSAdapter` into `JSSAesthetic`. Adapters are no longer passed to `Aesthetic`, they
  extend it.
  - A `jss` instance must now be passed to the constructor.
- Removed `aesthetic-adapter-jss/unified` import. Unified syntax is now required and enabled by
  default.
- Removed the ability to pass custom options to `jss.createStyleSheet`.

#### 🛠 Internal

- Converted from Flow to TypeScript.

# 2.4.0 - 05/30/18

#### 🚀 New

- Updated `aesthetic` peer requirement to 2.5.

# 2.3.2 - 05/21/18

#### 🐞 Fixed

- Fixed a bug in which the last font face in a list of multiple font faces (with different font
  families) was only being used, instead of the whole list.

# 2.3.1 - 03/20/18

#### 🐞 Fixed

- Fixed incorrectly built and published files.

# 2.3.0 - 03/20/18

#### 🚀 New

- Updated `jss` to 9.8.

# 2.2.1 - 01/30/18

#### 🛠 Internal

- Tested against `jss` 9.6.

# 2.2.0 - 01/13/18

#### 🚀 New

- Can now pass dynamic style objects to `transform` (will be akin to inline).
- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

# 2.1.0 - 01/03/18

#### 🚀 New

- Class names are now prefixed using the component name (the style name).
- Stylesheet media now defaults to `screen`.

# 2.0.0 - 01/02/18

#### 💥 Breaking

- Rewritten to support the
  [core 2.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Plugin `jss-nested` is now a requirement.

#### 🚀 New

- Updated `jss` to 9.5.
- Unified Syntax
  - Adds new `@charset`, `@global`, `@import`, `@namespace`, `@supports`, and `@viewport` at-rules.
  - Supports the new `@font-face` structure.

#### 🛠 Internal

- Rewritten Flowtype definitions.

# 1.7.1 - 11/10/17

#### 🛠 Internal

- Tested against React 16.1.
- Improved build process.

# 1.7.0 - 10/18/17

#### 🚀 New

- Updated `jss` to 9.0.

#### 🛠 Internal

- Enabled Yarn workspaces.
- Updated Flowtype definitions.

# 1.6.0 - 9/27/17

#### 🚀 New

- Added support for `react` 16.0.
- Updated `prop-types` to 15.6.

#### 🛠 Internal

- Updated cross package imports to use CommonJS paths.
- Improved the build process.

# 1.5.0 - 7/28/17

- Updated `jss` to 8.1.
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
- Updated JSS to 7.1.
