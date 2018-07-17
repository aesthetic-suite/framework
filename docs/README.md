# Aesthetic

Aesthetic is a powerful React library for styling components, whether it be CSS-in-JS
using style objects, importing stylesheets, or simply referencing external class names.
Simply put, Aesthetic is an abstraction layer that utilizes higher-order-components for
the compilation of styles via third-party libraries, all the while providing customizability,
theming, and a unified syntax.

Aesthetic was built for the sole purpose of solving the following scenarios, most of which
competing styling libraries fail to solve.

**Multiple styling patterns**

Want to use external CSS or Sass files? Or maybe CSS modules? Or perhaps CSS-in-JS?
What about JSS instead of Aphrodite? All of these patterns and choices are supported through
the use of [adapters](./adapters/README.md). However, inline styles _are not supported_
as we prefer the more performant option of compiling styles and attaching them to the DOM.

**Styling third-party libraries**

Using a third-party provided UI component library has the unintended side-effect
of hard-coded and non-customizable styles. Aesthetic solves this by allowing consumers
to [extend and inherit styles](./usage.md) from the provided base component.

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { StylesPropType } from 'aesthetic';
import withStyles, { classes } from '../path/to/styler';

class Carousel extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    styles: StylesPropType.isRequired,
  };

  // ...

  render() {
    const { children, styles } = this.props;
    const { animating } = this.state;

    return (
      <div
        role="tablist"
        className={classes(
          styles.carousel,
          animating && styles.carousel__animating,
        )}
      >
        <ul className={classes(styles.list)}>
          {children}
        </ul>

        <button
          type="button"
          onClick={this.handlePrev}
          className={classes(styles.button, styles.prev)}
        >
          ←
        </button>

        <button
          type="button"
          onClick={this.handleNext}
          className={classes(styles.button, styles.next)}
        >
          →
        </button>
      </div>
    );
  }
}

export default withStyles({
  carousel: {
    position: 'relative',
    maxWidth: '100%',
    // ...
  },
  carousel__animating: { ... },
  list: { ... },
  button: { ... },
  prev: { ... },
  next: { ... },
})(Carousel);
```
