# Style Adapters

An adapter in the context of Aesthetic is a third-party library that supports CSS in JavaScript,
whether it be injecting CSS styles based off JavaScript objects, importing CSS during a build
process, or simply referencing CSS class names.

The following libraries and their features are officially supported by Aesthetic.

|                  | Aphrodite | CSS classes | CSS modules | Fela | JSS | TypeStyle |
| :--------------- | :-------: | :---------: | :---------: | :--: | :-: | :-------: |
| Unified Syntax   |     ✓     |             |             |  ✓   |  ✓  |     ✓     |
| Globals          |    ✓²     |      ✓      |             |  ✓   |  ✓  |     ✓     |
| Selectors        |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Fallbacks        |           |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Fonts            |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Animations       |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Media Queries    |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Supports         |           |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Specificity      |     ✓     |      ✓      |      ✓      |  ✓   |     |     ✓     |
| Raw CSS¹         |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Right-to-Left¹   |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |     ✓     |
| Vendor Prefixing |     ✓     |      ✓      |      ✓      |  ✓   |  ✓  |           |

> 1.  Provided by Aesthetic. Not native to the adapter.
> 2.  Is accomplished through a custom
>     [global selector handler](https://github.com/Khan/aphrodite#creating-extensions).
