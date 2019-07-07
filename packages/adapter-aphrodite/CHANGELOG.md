# 4.0.0 - 2019-07-07

#### 💥 Breaking

- Rewritten to support the
  [core 4.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).

## 3.4.0 - 2019-04-28

#### 🛠 Internals

- Removed `@babel/runtime` as it wasn't saving much space and it conflicts with the new `core-js`
  pattern.

## 3.3.0 - 2019-02-26

#### 🚀 Updates

- Added support for raw CSS declarations in a style sheet.

#### 🐞 Fixes

- Added missing `@babel/runtime` package.

#### 🛠 Internals

- Updated `aphrodite` peer requirement to 2.3.

## 3.2.0 - 2019-02-14

#### 🛠 Internals

- Support for the new React hooks API.
- TS: Marked some `AphroditeAesthetic` class methods with access modifiers.

## 3.1.0 - 2019-02-09

#### 🚀 Updates

- Added ECMAScript module support via `esm/` built files.
- Removed copyright docblocks from source files to reduce bundle size.

# 3.0.0 - 2019-01-28

#### 💥 Breaking

- Rewritten to support the
  [core 3.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Refactored `AphroditeAdapter` into `AphroditeAesthetic`. Adapters are no longer passed to
  `Aesthetic`, they extend it.
- Removed `aesthetic-adapter-aphrodite/unified` import. Unified syntax is now required and enabled
  by default.
- Updated to always use `!important`.

#### 🛠 Internals

- Converted from Flow to TypeScript.

## 2.3.0 - 2018-05-30

#### 🚀 Updates

- Updated `aesthetic` peer requirement to 2.5.

### 2.2.1 - 2018-03-20

#### 🐞 Fixes

- Fixed incorrectly built and published files.

## 2.2.0 - 2018-03-20

#### 🚀 Updates

- Updated `aphrodite` to 2.1.

## 2.1.0 - 2018-01-13

#### 🚀 Updates

- Can now pass dynamic style objects to `transform` (will be akin to inline).
- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

# 2.0.0 - 2018-01-02

#### 💥 Breaking

- Rewritten to support the
  [core 2.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Constructor 1st argument now requires an array of extensions instead of an Aphrodite `StyleSheet`.

#### 🚀 Updates

- Supports global styles based on the
  [official Aphrodite extension example](https://github.com/Khan/aphrodite#creating-extensions).
  - Styles must be nested within a `globals` object.
  - Selectors must be prefixed with a `*`.
- Unified Syntax
  - Adds new `@global` at-rule.
  - Supports the new `@font-face` structure.

#### 🛠 Internals

- Rewritten Flowtype definitions.

### 1.6.2 - 2017-11-10

#### 🛠 Internals

- Tested against React 16.1.
- Improved build process.

### 1.6.1 - 2017-10-18

#### 🛠 Internals

- Enabled Yarn workspaces.
- Updated Flowtype definitions.

## 1.6.0 - 2017-09-27

#### 🚀 Updates

- Added support for `react` 16.0.
- Updated `prop-types` to 15.6.

#### 🛠 Internals

- Updated cross package imports to use CommonJS paths.
- Improved the build process.

## 1.5.0 - 2017-07-28

- Updated Flow definitions.
- Wrapped errors in `__DEV__` environment checks.

### 1.4.2 - 2017-06-19

- Fixed an issue with the Lerna package.

### 1.4.1 - 2017-06-19

- Updated `react` to 15.6.
- Updated `prop-types` to 15.5.10.

## 1.4.0 - 2017-05-11

- Updated IE requirement to 11+.
- Updated to include src/ files in the published package.

# 1.3.0 - 2017-04-24

- Updated to support React 15.5 and the new `prop-types` package.
