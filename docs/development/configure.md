# Configuration

Aesthetic provides a handful of options for customization through the `configure()` method. If you
would like to customize these options, import and call the method with an options object. This
customization should happen near the root of the application, _before_ any Aesthetic styled React
component is imported or rendered.

```ts
import { configure } from '@aesthetic/core';

configure({
  vendorPrefixes: true,
});
```

## Options

The following options are currently supported. These options are based on the `@aesthetic/style`
package. Jump over to the [official documentation](../style/options.md) for more information on
them. Do note however that the APIs differ, but the general concept is the same.

- `defaultUnit` (`string | (prop: string) => string`) - A unit to append to numerical values. Can be
  a string or a function that returns a string. Defaults to `px`.
- `deterministicClasses` (`boolean`) - Generate class names using a deterministic hash (`c1sjakp`)
  instead of an auto-incremented value (`a1`). Useful for scenarios like unit tests. Defaults to
  `false`.
- `vendorPrefixes` (`boolean`) - Apply vendor prefixes to properties and values that require it. We
  prefix features for browsers with >= 1% market share. Defaults to `false`.
