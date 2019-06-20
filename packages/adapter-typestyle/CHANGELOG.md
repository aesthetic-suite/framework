# 3.0.0

#### 💥 Breaking

- Rewritten to support the
  [core 4.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Updated to use `TypeStyle#stylesheet` instead of `TypeStyle#style`. Will now automatically include
  `$debugName` and prepend class names with the object property name.

## 2.4.0 - 2019-04-28

#### 🛠 Internals

- Removed `@babel/runtime` as it wasn't saving much space and it conflicts with the new `core-js`
  pattern.

## 2.3.0 - 2019-02-26

#### 🚀 Updates

- Added support for raw CSS declarations in a style sheet.

#### 🐞 Fixes

- Added missing `@babel/runtime` package.

## 2.2.0 - 2019-02-14

#### 🛠 Internals

- Support for the new React hooks API.
- TS: Marked some `TypeStyleAesthetic` class methods with access modifiers.

## 2.1.0 - 2019-02-09

#### 🚀 Updates

- Added ECMAScript module support via `esm/` built files.
- Removed copyright docblocks from source files to reduce bundle size.

# 2.0.0 - 2019-01-28

#### 💥 Breaking

- Rewritten to support the
  [core 3.0 changes](https://github.com/milesj/aesthetic/blob/master/packages/aesthetic/CHANGELOG.md).
- Refactored `TypeStyleAdapter` into `TypeStyleAesthetic`. Adapters are no longer passed to
  `Aesthetic`, they extend it.
  - A `TypeStyle` instance must now be passed to the constructor.
- Removed `aesthetic-adapter-typestyle/unified` import. Unified syntax is now required and enabled
  by default.
- Updated `typestyle` peer requirement to 2.0.

#### 🛠 Internals

- Converted from Flow to TypeScript.

## 1.3.0 - 2018-05-30

#### 🚀 Updates

- Updated `aesthetic` peer requirement to 2.5.

#### 🛠 Internals

- Removed `lodash.merge` dependency.

### 1.2.1 - 2018-03-20

#### 🐞 Fixes

- Fixed incorrectly built and published files.

## 1.2.0 - 2018-03-20

#### 🚀 Updates

- Updated `typestyle` to 1.7.

## 1.1.0 - 2018-01-13

#### 🚀 Updates

- Can now pass dynamic style objects to `transform` (will be akin to inline).
- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

#### 🐞 Fixes

- Resolved some issues with pseudo classes.

### 1.0.1 - 2018-01-03

#### 🛠 Internals

- Tested against TypeStyle 1.6.

# 1.0.0 - 2018-01-02

#### 🎉 Release

- Initial release!
