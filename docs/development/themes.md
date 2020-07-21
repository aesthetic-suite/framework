# Themes

Themes are an encapsulation of reusable variables and mixins for consistent styling, represented as
a `Theme` class. Themes are automatically generated when compiling a
[design system](../design/about.md) into [design tokens](../tokens/web/css-in-js.md).

## Registering themes

Themes can _only_ be accessed within a style sheet when registered into Aesthetic. We can achieve
this using the `registerTheme()` and `registerDefaultTheme()` methods, both of which require a
unique name and an optional [theme style sheet](../../development/style-sheets/themes.md). A default
theme can only be defined twice, once for a light color scheme, the other for a dark color scheme.

```ts
// setup.ts
import { registerTheme, registerDefaultTheme } from '@aesthetic/core';
import dayTheme from './system/dls/themes/day';
import nightTheme from './system/dls/themes/night';
import twilightTheme from './system/dls/themes/twilight';

registerDefaultTheme('day', dayTheme);
registerDefaultTheme('night', nightTheme);
registerTheme('twilight', twilightTheme);
```

> Registration should happen near the root of the application, _before_ any Aesthetic styled React
> component is imported or rendered.

## Changing themes

The currently active theme can be changed programmatically by calling the `changeTheme()` method
anywhere in your application.

```ts
import { changeTheme } from '@aesthetic/core';

changeTheme('twilight');
```
