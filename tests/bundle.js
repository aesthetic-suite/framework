import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { StyleSheet, css } from 'aphrodite';
import Aesthetic, {
  createStyler,
  classes,
  ClassNamesPropType,
  Adapter,
  ThemeProvider,
} from '../packages/aesthetic/src';

// Because of our Lerna pakages, we can't include to the local adapter.
// Just duplicate the logic here.
class AphroditeAdapter extends Adapter {
  unifiedSyntax = false;

  transformStyles(styleName, declarations) {
    const styleSheet = StyleSheet.create(declarations);
    const classNames = {};

    Object.keys(styleSheet).forEach((setName: string) => {
      classNames[setName] = css(styleSheet[setName]);
    });

    return classNames;
  }
}

const adapter = new AphroditeAdapter();
const aesthetic = new Aesthetic(adapter);
const style = createStyler(aesthetic);

aesthetic.registerTheme('default', {
  unit: 8,
  fg: '#fff',
  bg: '#B0BEC5',
  bgHover: '#CFD8DC',
  primary: '#29B6F6',
});

aesthetic.registerTheme('dark', {
  unit: 8,
  fg: '#eee',
  bg: '#212121',
  bgHover: '#424242',
  primary: '#01579B',
});

function BaseButton({ children, classNames, primary = false }) {
  console.log('BaseButton', 'classNames', classNames);

  return (
    <button
      type="button"
      className={classes(
        classNames.button,
        primary && classNames.button__primary,
      )}
    >
      {children}
    </button>
  );
}

BaseButton.propTypes = {
  children: PropTypes.node,
  classNames: ClassNamesPropType,
  primary: PropTypes.bool,
};

const Button = style(({ unit, bg, bgHover, fg, primary }) => ({
  button: {
    display: 'inline-block',
    border: 0,
    margin: 0,
    padding: `${unit}px ${unit * 2}px`,
    cursor: 'pointer',
    fontWeight: 'normal',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    textAlign: 'center',
    backgroundColor: bg,
    color: fg,
    ':hover': {
      backgroundColor: bgHover,
    },
    '@media (max-width: 600px)': {
      display: 'block',
    },
  },
  button__primary: {
    backgroundColor: primary,
  },
}))(BaseButton);

function App() {
  return (
    <ThemeProvider name="default">
      <div>
        <h3>Default Theme</h3>

        <Button>Foo</Button>
        <Button primary>Bar</Button>

        <ThemeProvider name="dark">
          <div>
            <h3>Dark Theme</h3>

            <Button>Foo</Button>
            <Button primary>Bar</Button>
          </div>
        </ThemeProvider>
      </div>
    </ThemeProvider>
  );
}

// Log the objects so we can inspect them
console.log('Aesthetic', aesthetic);
console.log('Adapter', adapter);

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('app'));
