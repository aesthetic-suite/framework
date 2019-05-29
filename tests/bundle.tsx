/* eslint-disable no-console, max-len, sort-keys, react/require-default-props, import/no-extraneous-dependencies, react/jsx-one-expression-per-line, react/jsx-no-literals, react-hooks/rules-of-hooks, @typescript-eslint/camelcase */

import React from 'react';
import ReactDOM from 'react-dom';
import { createRenderer as createFela } from 'fela';
import felaPreset from 'fela-preset-web';
import { create as createJSS } from 'jss';
// @ts-ignore
import jssPreset from 'jss-preset-default';
import { TypeStyle } from 'typestyle';
import Aesthetic from 'aesthetic';
import {
  useStylesFactory,
  useThemeFactory,
  withStylesFactory,
  WithStylesWrappedProps,
} from 'aesthetic-react';
import AphroditeAesthetic from 'aesthetic-adapter-aphrodite';
import FelaAesthetic from 'aesthetic-adapter-fela';
import JSSAesthetic from 'aesthetic-adapter-jss';
import TypeStyleAesthetic from 'aesthetic-adapter-typestyle';

// SETUP THEMES

interface Theme {
  unit: number;
  fg: string;
  bg: string;
  bgHover: string;
  primary: string;
}

const params = new URLSearchParams(location.search.slice(1));
const activeTheme = params.get('theme') || 'light';
const dirMode = params.get('mode') || 'ltr';

function registerThemes(aesthetic: Aesthetic<Theme, any, any>) {
  if (aesthetic.themes.light) {
    return;
  }

  aesthetic.registerTheme(
    'light',
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

  aesthetic.extendTheme('dark', 'light', {
    fg: '#eee',
    bg: '#212121',
    bgHover: '#424242',
    primary: '#01579B',
  });
}

function styleSheet({ unit, bg, bgHover, fg, primary }: Theme): any {
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

// SETUP AESTHETIC ADAPTERS

const options = { theme: activeTheme, rtl: dirMode === 'rtl' };

const aphrodite = new AphroditeAesthetic([], options);

const fela = new FelaAesthetic(
  createFela({
    plugins: [...felaPreset],
  }),
  options,
);

const jss = new JSSAesthetic(
  createJSS(
    // @ts-ignore
    jssPreset(),
  ),
  options,
);

const typeStyle = new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: true }), options);

// DEFINE HOC COMPONENT

interface HocProps {
  children: React.ReactNode;
  primary?: boolean;
}

function createHocComponent(aesthetic: Aesthetic<Theme, any, any>) {
  registerThemes(aesthetic);

  const withStyles = withStylesFactory(aesthetic);

  function Button({
    children,
    cx,
    styles,
    theme,
    primary = false,
  }: HocProps & WithStylesWrappedProps<Theme, any, any>) {
    const className = cx(styles.button, primary && styles.button__primary);

    console.log(aesthetic.constructor.name, 'HocButton', { styles, theme, className });

    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  }

  return withStyles(styleSheet, { passThemeProp: true })(Button);
}

// DEFINE HOOK COMPONENT

interface HookProps {
  children: React.ReactNode;
  primary?: boolean;
}

function createHookComponent(aesthetic: Aesthetic<Theme, any, any>) {
  registerThemes(aesthetic);

  const useStyles = useStylesFactory(aesthetic);
  const useTheme = useThemeFactory(aesthetic);

  return function Button({ children, primary = false }: HocProps) {
    const [styles, cx] = useStyles(styleSheet);
    const theme = useTheme();
    const className = cx(styles.button, primary && styles.button__primary);

    console.log(aesthetic.constructor.name, 'HookButton', { styles, theme, className });

    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  };
}

// RENDER DEMO APP

function DemoColumn({ aesthetic, title }: { aesthetic: Aesthetic<any, any>; title: string }) {
  const HocButton = createHocComponent(aesthetic);
  const HookButton = createHookComponent(aesthetic);

  return (
    <div style={{ marginRight: 25 }}>
      <h3>{title}</h3>

      <p>
        <HocButton>HOC</HocButton>
        <HocButton primary>HOC</HocButton>
      </p>

      <p>
        <HookButton>Hook</HookButton>
        <HookButton primary>Hook</HookButton>
      </p>
    </div>
  );
}

function App() {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <DemoColumn aesthetic={aphrodite} title="Aphrodite" />
        <DemoColumn aesthetic={fela} title="Fela" />
        <DemoColumn aesthetic={jss} title="JSS" />
        <DemoColumn aesthetic={typeStyle} title="TypeStyle" />
      </div>

      <h3>
        Theme: {activeTheme} (
        <a href={`?theme=${activeTheme === 'light' ? 'dark' : 'light'}`}>Switch</a>)
      </h3>

      <h3>
        Mode: {dirMode} (<a href={`?mode=${dirMode === 'ltr' ? 'rtl' : 'ltr'}`}>Switch</a>)
      </h3>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
