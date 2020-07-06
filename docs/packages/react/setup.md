# Getting started

Begin by installing Aesthetic, React, and ReactDOM.

```bash
yarn add @aesthetic/react react react-dom
```

If you're using TypeScript, also install required types.

```bash
yarn add --dev @types/react @types/react-dom
```

## Configuring Aesthetic

Aesthetic provides a handful of options for customization through the `configure()` method. If you
would like to customize these options, import and call the method with an options object. This
customization should happen near the root of the application, _before_ any Aesthetic styled React
component is imported or rendered.

```ts
import { configure } from '@aesthetic/react';

configure({
  vendorPrefixes: true,
});
```

The following options are currently supported.

- `defaultUnit` (`string | (prop: string) => string`) - A unit to append to numerical values. Can be
  a string or a function that returns a string. Defaults to `px`.
- `deterministicClasses` (`boolean`) - Generate class names using a deterministic hash (`c1sjakp`)
  instead of an auto-incremented value (`a1`). Useful for scenarios like unit tests. Defaults to
  `false`.
- `vendorPrefixes` (`boolean`) - Apply vendor prefixes to properties and values that require it. We
  prefix features for browsers with >= 1% market share. Defaults to `false`.

> These options are based on the `@aesthetic/style` package. Jump over to the
> [official documenation](../style/options.md) for more information on them. Do note however that
> the APIs differ, but the general concept is hte same.
