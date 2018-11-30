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
  primary?: boolean;
};

const theme = location.search.slice(1) || 'default';

// Aesthetic instances
function registerThemes(aesthetic: Aesthetic<Theme, any, any>) {
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

  console.log(aesthetic.constructor.name, aesthetic);

  return aesthetic;
}

const aphrodite = registerThemes(new AphroditeAesthetic<Theme>([], { theme }));

const fela = registerThemes(
  new FelaAesthetic<Theme>(
    createFela({
      plugins: [...felaPreset],
    }),
    { theme },
  ),
);

const jss = registerThemes(
  new JSSAesthetic<Theme>(
    createJSS(
      // @ts-ignore
      jssPreset(),
    ),
    { theme },
  ),
);

const typeStyle = registerThemes(
  new TypeStyleAesthetic<Theme>(new TypeStyle({ autoGenerateTag: true }), {
    theme,
  }),
);

// Helper functions
function createStyleSheet({ unit, bg, bgHover, fg, primary }: Theme): any {
  return {
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
  };
}

// withStyles HOC
function createHOCComponent(aesthetic: Aesthetic<Theme, any, any>) {
  function Button({
    children,
    styles,
    theme,
    primary = false,
  }: Props & WithStylesProps<Theme, any>) {
    const className = aesthetic.transformStyles(styles.button, primary && styles.button__primary);

    console.log('HOC Button', styles, className, theme);

    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  }

  return aesthetic.withStyles(createStyleSheet, { passThemeProp: true })(Button);
}

const AphroditeButton = createHOCComponent(aphrodite);
const FelaButton = createHOCComponent(fela);
const JSSButton = createHOCComponent(jss);
const TypeStyleButton = createHOCComponent(typeStyle);

// useStyles Hook
function createHookComponent(aesthetic: Aesthetic<Theme, any, any>) {
  const useStyles = aesthetic.useStyles();
  const useTheme = () => aesthetic.getTheme();

  return function Button(props: Props) {
    const { children, primary = false } = props;
    const styles = useStyles(createStyleSheet, props);
    const theme = useTheme();
    const className = aesthetic.transformStyles(styles.button, primary && styles.button__primary);

    console.log('Hook Button', className, styles, theme);

    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  };
}

const AphroditeHook = createHookComponent(aphrodite);
const FelaHook = createHookComponent(fela);
const JSSHook = createHookComponent(jss);
const TypeStyleHook = createHookComponent(typeStyle);

function App() {
  return (
    <div>
      <h3>Theme: {theme}</h3>

      <div>
        <h4>withStyles HOC</h4>

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

      <br />
      <br />

      <div>
        <h4>useStyles Hook</h4>

        <div>
          <AphroditeHook>Aphrodite</AphroditeHook>
          <AphroditeHook primary>Aphrodite</AphroditeHook>
        </div>

        <div>
          <FelaHook>Fela</FelaHook>
          <FelaHook primary>Fela</FelaHook>
        </div>

        <div>
          <JSSHook>JSS</JSSHook>
          <JSSHook primary>JSS</JSSHook>
        </div>

        <div>
          <TypeStyleHook>TypeStyle</TypeStyleHook>
          <TypeStyleHook primary>TypeStyle</TypeStyleHook>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
