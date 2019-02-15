# Style Adapters

An adapter in the context of Aesthetic is a third-party library that supports CSS in JavaScript,
whether it be injecting CSS styles based off JavaScript objects, importing CSS during a build
process, or simply referencing CSS class names.

The following libraries and their features are officially supported by Aesthetic.

| Adapter                                    | Unified Syntax | Globals¹ | Selectors | Fallbacks | Fonts | Animations | Media Queries | Supports | Specificity |
| :----------------------------------------- | :------------: | :------: | :-------: | :-------: | :---: | :--------: | :-----------: | :------: | :---------: |
| [Aphrodite](./aphrodite.md)                |       ✓        |    ✓²    |     ✓     |           |   ✓   |     ✓      |       ✓       |          |      ✓      |
| [CSS class names](../style.md#class-names) |                |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [CSS modules](./css-modules.md)            |                |          |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [Fela](./fela.md)                          |       ✓        |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |
| [JSS](./jss.md)                            |       ✓        |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |             |
| [TypeStyle](./typestyle.md)                |       ✓        |    ✓     |     ✓     |     ✓     |   ✓   |     ✓      |       ✓       |    ✓     |      ✓      |

> 1.  Unified syntax only.
> 2.  Is accomplished through a custom
>     [global selector handler](https://github.com/Khan/aphrodite#creating-extensions).
