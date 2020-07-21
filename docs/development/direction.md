# Directionality

Directionality is the concept of localizing and supporting both left-to-right (LTR) and
right-to-left (RTL) languages, also know as bi-directionality, or bidi. With Aesthetic,
directionality is built directly into the style engine and all integrations.

## Default direction

By default, when in a browser based environment, the primary direction will be inferred from the
document's `dir` attribute. If not defined or found, the direction will default to `ltr`.

```html
<html dir="ltr" lang="en" />
```

## Changing direction

The currently active direction can be changed programmatically by calling the `changeDirection()`
method within in your application. This will update the `dir` attribute on the document.

```ts
import { changeDirection } from '@aesthetic/core';

changeDirection('rtl');
```

## Resources

- [MDN: RTL guidelines](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/RTL_Guidelines)
- [RTL styling 101](https://rtlstyling.com/posts/rtl-styling)
