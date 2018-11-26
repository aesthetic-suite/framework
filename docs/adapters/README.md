# Style Adapters

An adapter in the context of Aesthetic is a third-party library that supports CSS in JavaScript,
whether it be injecting CSS styles based off JavaScript objects, importing CSS during a build
process, or simply referencing CSS class names.

The following libraries and their features are officially supported by Aesthetic.

| Adapter                                         | Unified Syntax | Globals¹ | Selectors | Fallbacks | Fonts | Animations | Media Queries | Supports | Specificity |
| :---------------------------------------------- | :------------: | :------: | :-------: | :-------: | :---: | :--------: | :-----------: | :------: | :---------: |
| [Aphrodite](./aphrodite.md)                     |       ✓        |    ✓²    |     ✓     |           |   ✓   |     ✓      |       ✓       |          |      ✓      |
| [CSS class names](../style.md#external-classes) |                |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [CSS modules](./css-modules.md)                 |                |          |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [Fela](./fela.md)                               |       ✓        |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [Glamor](./glamor.md)                           |       ✓        |          |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [JSS](./jss.md)                                 |       ✓        |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |             |
| [TypeStyle](./typestyle.md)                     |       ✓        |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |

> 1.  Unified syntax only.
> 2.  Is accomplished through a custom
>     [global selector handler](https://github.com/Khan/aphrodite#creating-extensions).

The following libraries are currently not supported.

- [CSSX](https://github.com/krasimir/cssx) - Does not generate unique class names during compilation
  and instead uses the literal class names and or tag names defined in the style declaration. This
  allows for global style collisions, which we want to avoid.
- [Styletron](https://github.com/rtsao/styletron) - Currently does not support animations, font
  faces, or globals. Will revisit in the future.
