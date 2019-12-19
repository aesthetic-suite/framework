# 5.0.0 - 2019-12-19

#### 💥 Breaking

- Rewritten to support the
  [core 5.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).

# 4.0.0 - 2019-07-07

#### 💥 Breaking

- Rewritten to support the
  [core 4.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).

## 3.3.0 - 2019-04-28

#### 🛠 Internals

- Removed `@babel/runtime` as it wasn't saving much space and it conflicts with the new `core-js`
  pattern.

## 3.2.0 - 2019-02-26

#### 🐞 Fixes

- Added missing `@babel/runtime` package.

## 3.1.0 - 2019-02-09

#### 🚀 Updates

- Added ECMAScript module support via `esm/` built files.
- Removed copyright docblocks from source files to reduce bundle size.

# 3.0.0 - 2019-01-28

#### 💥 Breaking

- Rewritten to support the
  [core 3.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Refactored `CSSModulesAdapter` into `CSSModulesAesthetic`. Adapters are no longer passed to
  `Aesthetic`, they extend it.

#### 🛠 Internals

- Converted from Flow to TypeScript.

## 2.1.0 - 2018-05-30

#### 🚀 Updates

- Updated `aesthetic` peer requirement to 2.5.

### 2.0.3 - 2018-03-20

#### 🐞 Fixes

- Fixed incorrectly built and published files.

### 2.0.2 - 2018-03-20

#### 🛠 Internals

- Updated dependencies.

### 2.0.1 - 2018-01-13

#### 🛠 Internals

- Updated dependencies.

# 2.0.0 - 2018-01-02

#### 💥 Breaking

- Rewritten to support the
  [core 2.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).

#### 🐞 Fixes

- Fixed a bug in which wrong class names were being created.

#### 🛠 Internals

- Rewritten Flowtype definitions.

### 1.6.2 - 2017-11-10

#### 🛠 Internals

- Tested against React 16.1.
- Improved build process.

### 1.6.1 - 2017-10-18

#### 🛠 Internals

- Enabled Yarn workspaces.

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
