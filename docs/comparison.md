# Competitors Comparison

A brief comparison of Aesthetic to competing React style abstraction libraries.

## Features

|                 | aesthetic | [react-with-styles][react-with-styles] | [styled-components][styled-components] | [radium][radium] |
| --------------- | :-------: | :------------------------------------: | :------------------------------------: | :--------------: |
| Abstraction     |    HOC    |                  HOC                   |           Template Literals            |       HOC        |
| Type            |  Classes  |         Classes, Inline styles         |                Classes                 |  Inline styles   |
| Unified Syntax  |     ✓     |                                        |                                        |                  |
| Caching         |     ✓     |                                        |                   ✓                    |       N/A        |
| Themes          |     ✓     |                   ✓                    |                   ✓                    |                  |
| Style Extending |     ✓     |                                        |                   ✓                    |                  |  |

## Adapters

|                                                | aesthetic | [react-with-styles][react-with-styles] | [styled-components][styled-components] | [radium][radium] |
| ---------------------------------------------- | :-------: | :------------------------------------: | :------------------------------------: | :--------------: |
| [Aphrodite](./adapters/aphrodite.md)           |     ✓     |                   ✓                    |                                        |                  |
| [CSS class names](./style.md#external-classes) |     ✓     |                                        |                                        |                  |
| [CSS Modules](./adapters/css-modules.md)       |     ✓     |                                        |                                        |                  |
| [Fela](./adapters/fela.md)                     |     ✓     |                                        |                                        |                  |
| [Glamor](./adapters/glamor.md)                 |     ✓     |                                        |                   ✓                    |                  |
| [JSS](./adapters/jss.md)                       |     ✓     |                   ✓                    |                                        |                  |
| [TypeStyle](./adapters/typestyle.md)           |     ✓     |                                        |                                        |                  |  |

[radium]: https://github.com/FormidableLabs/radium
[react-with-styles]: https://github.com/airbnb/react-with-styles
[styled-components]: https://github.com/styled-components/styled-components
