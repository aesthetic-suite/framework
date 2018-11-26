/* eslint-disable no-console, max-len, sort-keys, react/require-default-props, react/jsx-one-expression-per-line, react/jsx-no-literals */

import React from 'react';
import ReactDOM from 'react-dom';
import { createRenderer as createFela } from 'fela';
import felaPreset from 'fela-preset-web';
import { create as createJSS } from 'jss';
// @ts-ignore
import jssPreset from 'jss-preset-default';
import { TypeStyle } from 'typestyle';
import Aesthetic, { WithStylesProps } from 'aesthetic';
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import FelaAesthetic from 'aesthetic-adapter-fela';
import JSSAesthetic from 'aesthetic-adapter-jss';
import TypeStyleAesthetic from 'aesthetic-adapter-typestyle';

type Theme = {
  unit: number;
  fg: string;
  bg: string;
  bgHover: string;
  primary: string;
};

type Props = {
  children: React.ReactNode;
  classes?: any;
  primary?: boolean;
} & WithStylesProps<Theme, any>;

const theme = location.search.slice(1) || 'default';

function createStyledComponent(
  aesthetic: Aesthetic<Theme, any, any>,
  Component: React.ComponentType<Props>,
) {
  aesthetic.registerTheme(
    'default',
    {
      unit: 8,
      fg: '#fff',
      bg: '#B0BEC5',
      bgHover: '#CFD8DC',
      primary: '#29B6F6',
    },
    ({ unit }) => ({
      '@global': {
        'html, body': {
          padding: 0,
          margin: 0,
        },
        body: {
          padding: unit,
          fontFamily: 'Tahoma',
        },
      },
    }),
  );

  aesthetic.extendTheme('dark', 'default', {
    fg: '#eee',
    bg: '#212121',
    bgHover: '#424242',
    primary: '#01579B',
  });

  // Log the objects so we can inspect them
  console.log(aesthetic.constructor.name, aesthetic);

  function css(...styles: any[]): string {
    return aesthetic.transformStyles(...styles);
  }

  function WrappedComponent(props: Props) {
    return <Component {...props} classes={css} />;
  }

  return aesthetic.withStyles(({ unit, bg, bgHover, fg, primary }) => ({
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
          width: '100%',
        },
      },
    },
    button__primary: {
      backgroundColor: primary,
    },
  }))(WrappedComponent);
}

function Button({ children, classes, styles, primary = false }: Props) {
  const className = classes(styles.button, primary && styles.button__primary);

  console.log('Button', 'classNames', styles, className);

  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

const AphroditeButton = createStyledComponent(new AphroditeAesthetic([], { theme }), Button);

const FelaButton = createStyledComponent(
  new FelaAesthetic(
    createFela({
      plugins: [...felaPreset],
    }),
    { theme },
  ),
  Button,
);

const JSSButton = createStyledComponent(
  new JSSAesthetic(
    createJSS(
      // @ts-ignore
      jssPreset(),
    ),
    { theme },
  ),
  Button,
);

const TypeStyleButton = createStyledComponent(
  new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: true }), { theme }),
  Button,
);

function App() {
  return (
    <div>
      <h3>Theme: {theme}</h3>

      <div>
        <AphroditeButton>Aphrodite</AphroditeButton>
        <AphroditeButton primary>Aphrodite</AphroditeButton>
      </div>

      <div>
        <FelaButton>Fela</FelaButton>
        <FelaButton primary>Fela</FelaButton>
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
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
