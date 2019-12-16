/* eslint-disable no-console, max-len, sort-keys, react/require-default-props, import/no-extraneous-dependencies, react/jsx-one-expression-per-line, react/jsx-no-literals, react-hooks/rules-of-hooks, @typescript-eslint/camelcase */

import React from 'react';
import ReactDOM from 'react-dom';
import { createRenderer as createFela } from 'fela';
import felaPreset from 'fela-preset-web';
import { create as createJSS } from 'jss';
import jssPreset from 'jss-preset-default';
import { TypeStyle } from 'typestyle';
import aesthetic, { Adapter, StyleSheet } from 'aesthetic';
import {
  useStyles,
  useTheme,
  withStyles,
  WithStylesWrappedProps,
  ThemeProvider,
  DirectionProvider,
} from 'aesthetic-react';
import AphroditeAdapter from 'aesthetic-adapter-aphrodite';
import FelaAdapter from 'aesthetic-adapter-fela';
import JSSAdapter from 'aesthetic-adapter-jss';
import TypeStyleAdapter from 'aesthetic-adapter-typestyle';

// SETUP THEMES

interface Theme {
  unit: number;
  fg: string;
  bg: string;
  bgHover: string;
  primary: string;
}

const params = new URLSearchParams(location.search.slice(1));
const chosenAdapter = params.get('adapter') || 'aphrodite';
const activeTheme = params.get('theme') || 'light';
const dirMode = params.get('mode') || 'ltr';

// SETUP AESTHETIC ADAPTERS

const adapters = {
  aphrodite: () => new AphroditeAdapter([]),
  fela: () =>
    new FelaAdapter(
      createFela({
        plugins: [...felaPreset],
      }),
    ),
  jss: () => new JSSAdapter(createJSS(jssPreset())),
  typeStyle: () => new TypeStyleAdapter(new TypeStyle({ autoGenerateTag: true })),
};

if (adapters[chosenAdapter]) {
  const adapter = adapters[chosenAdapter]();

  aesthetic.configure({
    adapter,
    rtl: dirMode === 'rtl',
    theme: activeTheme,
  });

  console.log('Aesthetic', aesthetic);
  console.log('Adapter', adapter);
} else {
  throw new Error('Invalid adapter!');
}

// SETUP AESTHETIC

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

aesthetic.registerTheme('light', {}, null, 'default');

aesthetic.registerTheme(
  'dark',
  {
    fg: '#eee',
    bg: '#212121',
    bgHover: '#424242',
    primary: '#01579B',
  },
  null,
  'default',
);

// SETUP STYLES

function styleSheet({ unit, bg, bgHover, fg, primary }: Theme): StyleSheet {
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

// DEFINE HOC COMPONENT

interface HocProps {
  children: React.ReactNode;
  primary?: boolean;
}

function BaseButton({
  children,
  cx,
  styles,
  theme,
  primary = false,
}: HocProps & WithStylesWrappedProps) {
  const className = cx(styles.button, primary && styles.button__primary);

  console.log('HocButton', { styles, theme, className });

  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

const HocButton = withStyles(styleSheet, { passThemeProp: true })(BaseButton);

// DEFINE HOOK COMPONENT

interface HookProps {
  children: React.ReactNode;
  primary?: boolean;
}

function HookButton({ children, primary = false }: HookProps) {
  const [styles, cx] = useStyles(styleSheet);
  const theme = useTheme();
  const className = cx(styles.button, primary && styles.button__primary);

  console.log('HookButton', { styles, theme, className });

  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

// RENDER DEMO APP

function DemoColumn({ theme, dir }: { theme?: string; dir?: 'ltr' | 'rtl' }) {
  let content = (
    <div>
      <h3>
        {theme} + {dir}
      </h3>

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

  if (theme) {
    content = <ThemeProvider name={theme}>{content}</ThemeProvider>;
  }

  if (dir) {
    content = <DirectionProvider dir={dir}>{content}</DirectionProvider>;
  }

  return <div style={{ marginRight: 25 }}>{content}</div>;
}

function App() {
  const otherTheme = activeTheme === 'light' ? 'dark' : 'light';
  const otherDir = dirMode === 'ltr' ? 'rtl' : 'ltr';

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    params.set('adapter', event.currentTarget.value);

    location.href = `${location.pathname}?${params.toString()}`;
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <DemoColumn theme={activeTheme} dir={dirMode as 'ltr'} />
        </div>

        <div>
          <DemoColumn theme={otherTheme} dir={otherDir} />
        </div>
      </div>

      <br />

      <h4>
        Theme: {activeTheme} (<a href={`?theme=${otherTheme}`}>Switch</a>)
      </h4>

      <h4>
        Mode: {dirMode} (<a href={`?mode=${otherDir}`}>Switch</a>)
      </h4>

      <h4>
        Adapter:{' '}
        <select defaultValue={chosenAdapter} onChange={handleChange}>
          {Object.keys(adapters).map(key => (
            <option value={key}>{key}</option>
          ))}
        </select>
      </h4>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
