# Competitors Comparison

A brief comparison of Aesthetic to competing React style abstraction libraries.

## Features

|                 | aesthetic | [react-with-styles][react-with-styles] | [styled-components][styled-components] | [emotion][emotion] |
| --------------- | :-------: | :------------------------------------: | :------------------------------------: | :----------------: |
| Abstraction     | HOC, Hook |                  HOC                   |            Template literal            |  Template literal  |
| Styling         |  Object   |                 Object                 |            Template, Object            |  Template, Object  |
| Type            |  Classes  |         Classes, Inline styles         |                Classes                 |      Classes       |
| Unified Syntax  |     ✓     |                                        |                                        |                    |
| Caching         |     ✓     |                                        |                   ✓                    |         ✓          |
| Themes          |     ✓     |                   ✓                    |                   ✓                    |         ✓          |
| Style Extending |     ✓     |                                        |                   ✓                    |         ✓          |

## Adapters

|                                           | aesthetic | [react-with-styles][react-with-styles] | [styled-components][styled-components] | [emotion][emotion] |
| ----------------------------------------- | :-------: | :------------------------------------: | :------------------------------------: | :----------------: |
| [Aphrodite](./adapters/aphrodite.md)      |     ✓     |                   ✓                    |                                        |                    |
| [CSS class names](./style.md#class-names) |     ✓     |                                        |                                        |                    |
| [CSS Modules](./adapters/css-modules.md)  |     ✓     |                                        |                                        |                    |
| [Fela](./adapters/fela.md)                |     ✓     |                                        |                                        |                    |
| [JSS](./adapters/jss.md)                  |     ✓     |                   ✓                    |                                        |                    |
| [TypeStyle](./adapters/typestyle.md)      |     ✓     |                                        |                                        |                    |

[emotion]: https://github.com/emotion-js/emotion
[react-with-styles]: https://github.com/airbnb/react-with-styles
[styled-components]: https://github.com/styled-components/styled-components
