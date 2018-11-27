# 2.0.0

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

# 1.3.0 - 05/30/18

#### 🚀 New

- Updated `aesthetic` peer requirement to 2.5.

#### 🛠 Internal

- Removed `lodash.merge` dependency.

# 1.2.1 - 03/20/18

#### 🐞 Fixed

- Fixed incorrectly built and published files.

# 1.2.0 - 03/20/18

#### 🚀 New

- Updated `typestyle` to 1.7.

# 1.1.0 - 01/13/18

#### 🚀 New

- Can now pass dynamic style objects to `transform` (will be akin to inline).
- Unified Syntax
  - Attribute selectors are now supported when starting with `[`.
  - Direct descendant selectors are now supported with `>`.
  - Multiple selectors are now supported by separating each selector with a comma.

#### 🐞 Fixed

- Resolved some issues with pseudo classes.

# 1.0.1 - 01/03/18

#### 🛠 Internal

- Tested against TypeStyle 1.6.

# 1.0.0 - 01/02/18

#### 🎉 Release

- Initial release!