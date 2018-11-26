# 3.0.0

#### 💥 Breaking

- Rewritten to support the
  [core 3.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Refactored `FelaAdapter` into `FelaAesthetic`. Adapters are no longer passed to `Aesthetic`, they
  extend it.
  - A `fela` instance must now be passed to the constructor.
- Removed `aesthetic-adapter-fela/unified` import. Unified syntax is now required and enabled by
  default.
- Dropped `fela-dom` v6 support.

#### 🛠 Internal

- Converted from Flow to TypeScript.

# 2.2.0 - 05/30/18

#### 🚀 New

- Updated `aesthetic` peer requirement to 2.5.

# 2.1.2 - 03/20/18

#### 🐞 Fixed

- Fixed incorrectly built and published files.

# 2.1.1 - 03/20/18

#### 🛠 Internal

- Updated dependencies.

# 2.1.0 - 01/13/18

#### 🚀 New

- Can now pass dynamic style objects to `transform` (will be akin to inline).
- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

# 2.0.0 - 01/02/18

#### 💥 Breaking

- Rewritten to support the
  [core 2.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Removed `react-native` support.
- Unified Syntax
  - The `@font-face` at-rule now requires an array of `srcPaths`.

#### 🚀 New

- Added support for `fela-dom` 7.0.
- Unified Syntax
  - Adds new `@global` and `@supports` at-rules.
  - Supports the new `@font-face` structure.

#### 🛠 Internal

- Rewritten Flowtype definitions.

# 1.7.2 - 11/10/17

#### 🛠 Internal

- Tested against React 16.1.
- Improved build process.

# 1.7.1 - 10/18/17

#### 🛠 Internal

- Enabled Yarn workspaces.
- Updated Flowtype definitions.

# 1.7.0 - 9/27/17

#### 🚀 New

- Added support for `react` 16.0.
- Updated `prop-types` to 15.6.
- Updated `fela` and `fela-dom` to 6.0.

#### 🛠 Internal

- Updated cross package imports to use CommonJS paths.
- Improved the build process.

# 1.6.0 - 7/28/17

- Updated Flow definitions.
- Wrapped errors in `__DEV__` environment checks.

# 1.5.1 - 6/19/17

- Fixed an issue with the Lerna package.

# 1.5.0 - 6/19/17

- Updated `fela` to 5.0.
- Updated `react` to 15.6.
- Updated `prop-types` to 15.5.10.

# 1.4.0 - 5/11/17

- Updated IE requirement to 11+.
- Updated to include src/ files in the published package.

# 1.3.0 - 4/24/17

- Updated to support React 15.5 and the new `prop-types` package.
