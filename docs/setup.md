# Creating A Styler

To start using Aesthetic, a styler function must be created. This styler function
acts as a factory for the creation of higher-order-components
([HOC](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)).
These HOC's are used in passing down styles to the original wrapped component.

To begin, we must instantiate `Aesthetic` with an [adapter](./adapters), and pass it to
`createStyler` to create the `style` and `transform` functions. The `style` function is the HOC
factory, while `transform` will combine and process multiple style objects into a CSS class name.

```javascript
import Aesthetic, { createStyler } from 'aesthetic';
import JSSAdapter from 'aesthetic-adapter-jss'; // Or your chosen adapter

const { style, transform } = createStyler(new Aesthetic(new JSSAdapter()));

export const classes = transform; // Or another utility name
export default style;
```

> I suggest doing this an a file that can be imported for reusability.

Once we have a styler function, we can import it and wrap our React components.
The styler function accepts a [style sheet](./style.md) as its 1st argument,
and an object of configurable options as the second. The following options are supported.

* `styleName` (string) - The unique style name of the component. This name is primarily
  used in logging and caching. Defaults to the component or function name.
* `extendable` (boolean) - Allows the component and its styles to be extended,
  creating a new component in the process. Defaults to `false`.
* `stylesPropName` (string) - Name of the prop in which the style sheet is passed to.
  Defaults to `styles`.
* `themePropName` (string) - Name of the prop in which the theme sheet is passed to.
  Defaults to `theme`.
* `pure` (boolean) - When true, the higher-order-component will extend `React.PureComponent`
  instead of `React.Component`. Only use this for static/dumb components.

```javascript
export default withStyles({
  button: { ... },
}, {
  styleName: 'CustomButton',
  extendable: true,
  pure: true,
  stylesPropName: 'styleSheets',
  themePropName: 'appTheme',
})(Button);
```

If you get tired of passing `stylesPropName`, `themePropName`, `pure`, and `extendable`
to every component, you can pass these as default options to the `Aesthetic` instance.

```javascript
new Aesthetic(adapter, {
  extendable: true,
  pure: true,
  stylesPropName: 'styleSheets',
  themePropName: 'appTheme',
})
```
