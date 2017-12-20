/* eslint-disable no-console, max-len, sort-keys, react/require-default-props, react/jsx-one-expression-per-line, react/forbid-prop-types */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createRenderer as createFela } from 'fela';
import felaPreset from 'fela-preset-web';
import { create as createJSS } from 'jss';
import jssPreset from 'jss-preset-default';
import Aesthetic from '../packages/aesthetic/src/Aesthetic';
import createStyler from '../packages/aesthetic/src/createStyler';
import ThemeProvider from '../packages/aesthetic/src/ThemeProvider';
import AphroditeAdapter from '../packages/aesthetic-adapter-aphrodite/src/UnifiedAdapter';
import FelaAdapter from '../packages/aesthetic-adapter-fela/src/UnifiedAdapter';
import GlamorAdapter from '../packages/aesthetic-adapter-glamor/src/UnifiedAdapter';
import JSSAdapter from '../packages/aesthetic-adapter-jss/src/UnifiedAdapter';
import TypeStyleAdapter from '../packages/aesthetic-adapter-typestyle/src/UnifiedAdapter';

function createStyledComponent(adapter, Component) {
  const aesthetic = new Aesthetic(adapter);
  const { style, transform } = createStyler(aesthetic);

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

  // Log the objects so we can inspect them
  console.log(adapter.constructor.name.replace('UnifiedAdapter', ''), aesthetic);

  function WrappedComponent(props) {
    return <Component {...props} classes={transform} />;
  }

  return style(({
    unit,
    bg,
    bgHover,
    fg,
    primary,
  }) => ({
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
      '@media': {
        '(max-width: 600px)': {
          display: 'block',
        },
      },
    },
    button__primary: {
      backgroundColor: primary,
    },
  }))(WrappedComponent);
}

function Button({
  children,
  classes,
  styles,
  primary = false,
}) {
  const className = classes(
    styles.button,
    primary && styles.button__primary,
  );

  console.log('Button', 'classNames', styles, className);

  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.func,
  primary: PropTypes.bool,
  styles: PropTypes.object,
};

const AphroditeButton = createStyledComponent(new AphroditeAdapter(), Button);
const FelaButton = createStyledComponent(new FelaAdapter(createFela({
  plugins: [...felaPreset],
})), Button);
const GlamorButton = createStyledComponent(new GlamorAdapter(), Button);
const JSSButton = createStyledComponent(new JSSAdapter(createJSS(jssPreset())), Button);
const TypeStyleButton = createStyledComponent(new TypeStyleAdapter(), Button);

function App() {
  return (
    <ThemeProvider name="default">
      <div>
        <h3>Default Theme</h3>

        <div>
          <AphroditeButton>Aphrodite</AphroditeButton>
          <AphroditeButton primary>Aphrodite</AphroditeButton>
        </div>

        <div>
          <FelaButton>Fela</FelaButton>
          <FelaButton primary>Fela</FelaButton>
        </div>

        <div>
          <GlamorButton>Glamor</GlamorButton>
          <GlamorButton primary>Glamor</GlamorButton>
        </div>

        <div>
          <JSSButton>JSS</JSSButton>
          <JSSButton primary>JSS</JSSButton>
        </div>

        <div>
          <TypeStyleButton>TypeStyle</TypeStyleButton>
          <TypeStyleButton primary>TypeStyle</TypeStyleButton>
        </div>

        <ThemeProvider name="dark">
          <div>
            <h3>Dark Theme</h3>

            <div>
              <AphroditeButton>Aphrodite</AphroditeButton>
              <AphroditeButton primary>Aphrodite</AphroditeButton>
            </div>

            <div>
              <FelaButton>Fela</FelaButton>
              <FelaButton primary>Fela</FelaButton>
            </div>

            <div>
              <GlamorButton>Glamor</GlamorButton>
              <GlamorButton primary>Glamor</GlamorButton>
            </div>

            <div>
              <JSSButton>JSS</JSSButton>
              <JSSButton primary>JSS</JSSButton>
            </div>

            <div>
              <TypeStyleButton>TypeStyle</TypeStyleButton>
              <TypeStyleButton primary>TypeStyle</TypeStyleButton>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
