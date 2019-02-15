/* eslint-disable no-console, max-len, sort-keys, react/require-default-props, react/jsx-one-expression-per-line, react/jsx-no-literals, @typescript-eslint/camelcase */

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

// SETUP THEMES

interface Theme {
  unit: number;
  fg: string;
  bg: string;
  bgHover: string;
  primary: string;
}

const activeTheme = location.search.slice(1) || 'light';

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

const aphrodite = new AphroditeAesthetic([], { theme: activeTheme });

const fela = new FelaAesthetic(
  createFela({
    plugins: [...felaPreset],
  }),
  { theme: activeTheme },
);

const jss = new JSSAesthetic(
  createJSS(
    // @ts-ignore
    jssPreset(),
  ),
  { theme: activeTheme },
);

const typeStyle = new TypeStyleAesthetic(new TypeStyle({ autoGenerateTag: true }), {
  theme: activeTheme,
});

// DEFINE HOC COMPONENT

interface HocProps {
  children: React.ReactNode;
  primary?: boolean;
}

function createHocComponent(aesthetic: Aesthetic<Theme, any, any>) {
  registerThemes(aesthetic);

  function Button({
    children,
    styles,
    theme,
    primary = false,
  }: HocProps & WithStylesProps<Theme, any>) {
    const className = aesthetic.transformStyles(styles.button, primary && styles.button__primary);

    console.log(aesthetic.constructor.name, 'HocButton', { styles, theme, className });

    return (
      <button type="button" className={className}>
        {children}
      </button>
    );
  }

  return aesthetic.withStyles(styleSheet, { passThemeProp: true })(Button);
}

// DEFINE HOOK COMPONENT

interface HookProps {
  children: React.ReactNode;
  primary?: boolean;
}

function createHookComponent(aesthetic: Aesthetic<Theme, any, any>) {
  registerThemes(aesthetic);

  return function Button({ children, primary = false }: HocProps) {
    const [styles, cx] = aesthetic.useStyles(styleSheet);
    const theme = aesthetic.useTheme();
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

      <h3>Theme: {activeTheme}</h3>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
