# 2.3.0

#### 🚀 New

- Added support for raw CSS declarations in a style sheet.

#### 🐞 Fixed

- Added missing `@babel/runtime` package.

# 2.2.0 - 2019-02-14

#### 🛠 Internal

- Support for the new React hooks API.
- TS: Marked some `TypeStyleAesthetic` class methods with access modifiers.

# 2.1.0 - 2019-02-09

#### 🚀 New

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

#### 🛠 Internal

- Converted from Flow to TypeScript.

# 1.3.0 - 2018-05-30

#### 🚀 New

- Updated `aesthetic` peer requirement to 2.5.

#### 🛠 Internal

- Removed `lodash.merge` dependency.

# 1.2.1 - 2018-03-20

#### 🐞 Fixed

- Fixed incorrectly built and published files.

# 1.2.0 - 2018-03-20

#### 🚀 New

- Updated `typestyle` to 1.7.

# 1.1.0 - 2018-01-13

#### 🚀 New

- Can now pass dynamic style objects to `transform` (will be akin to inline).
- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

#### 🐞 Fixed

- Resolved some issues with pseudo classes.

# 1.0.1 - 2018-01-03

#### 🛠 Internal

- Tested against TypeStyle 1.6.

# 1.0.0 - 2018-01-02

#### 🎉 Release

- Initial release!
