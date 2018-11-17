import { create } from 'jss';
import preset from 'jss-preset-default';
import JSSAesthetic from '../src/JSSAesthetic';
import {
  FONT_ROBOTO_FLAT_SRC,
  FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
  KEYFRAME_FADE,
  SYNTAX_UNIFIED_LOCAL_FULL,
  SYNTAX_ATTRIBUTE,
  SYNTAX_DESCENDANT,
  SYNTAX_FALLBACKS,
  SYNTAX_FONT_FACE,
  SYNTAX_FONT_FACE_MIXED,
  SYNTAX_FONT_FACE_MULTIPLE,
  SYNTAX_GLOBAL,
  SYNTAX_KEYFRAMES,
  SYNTAX_MEDIA_QUERY,
  SYNTAX_MULTI_SELECTOR,
  SYNTAX_PROPERTIES,
  SYNTAX_PSEUDO,
  SYNTAX_SUPPORTS,
  SYNTAX_VIEWPORT,
  SYNTAX_CHARSET,
  SYNTAX_IMPORT,
  SYNTAX_IMPORT_MULTIPLE,
} from '../../../tests/mocks';
import { cleanStyles } from '../../../tests/helpers';

describe('JSSAesthetic', () => {
  let instance: JSSAesthetic<any>;

  function renderAndTest(styles: any, expStyles: any, global: boolean = false) {
    const nativeSheet = global
      ? instance.syntax.convertGlobalSheet(styles).toObject()
      : instance.syntax.convertStyleSheet(styles).toObject();
    const styleSheet = instance.processStyleSheet(nativeSheet, 'test');

    expect(nativeSheet).toEqual(expStyles);

    expect(instance.transformStyles(...Object.values(styleSheet))).toMatchSnapshot();

    expect(cleanStyles(instance.sheet.toString())).toMatchSnapshot();
  }

  beforeEach(() => {
    const jss = create();
    jss.setup(preset());

    instance = new JSSAesthetic(jss);
  });

  it('converts and transforms inline styles', () => {
    expect(instance.transformToClassName(['foo', { margin: 0 }, { padding: 2 }])).toMatchSnapshot();
    expect(instance.transformToClassName(['foo', null])).toMatchSnapshot();
  });

  describe('global sheet', () => {
    it('handles globals', () => {
      renderAndTest(
        SYNTAX_GLOBAL,
        {
          '@global': {
            body: { margin: 0 },
            html: { height: '100%' },
            a: {
              color: 'red',
              '&:hover': {
                color: 'darkred',
              },
            },
          },
        },
        true,
      );
    });

    it('handles @font-face', () => {
      renderAndTest(
        SYNTAX_FONT_FACE,
        {
          '@font-face': [FONT_ROBOTO_FLAT_SRC],
        },
        true,
      );
    });

    it('handles mixed @font-face', () => {
      renderAndTest(
        SYNTAX_FONT_FACE_MIXED,
        {
          '@font-face': [FONT_ROBOTO_FLAT_SRC, ...FONT_CIRCULAR_MULTIPLE_FLAT_SRC],
        },
        true,
      );
    });

    it('handles multiple @font-face', () => {
      renderAndTest(
        SYNTAX_FONT_FACE_MULTIPLE,
        {
          '@font-face': FONT_CIRCULAR_MULTIPLE_FLAT_SRC,
        },
        true,
      );
    });

    it('handles @keyframes', () => {
      renderAndTest(
        SYNTAX_KEYFRAMES,
        {
          '@keyframes fade': KEYFRAME_FADE,
        },
        true,
      );
    });

    it('handles @viewport', () => {
      renderAndTest(
        SYNTAX_VIEWPORT,
        {
          '@viewport': {
            width: 'device-width',
            orientation: 'landscape',
          },
        },
        true,
      );
    });

    it('handles @charset', () => {
      renderAndTest(
        SYNTAX_CHARSET,
        {
          '@charset': 'utf8',
        },
        true,
      );
    });

    it('handles single @import', () => {
      renderAndTest(
        SYNTAX_IMPORT,
        {
          '@import': ['./some/path.css'],
        },
        true,
      );
    });

    it('handles multiple @import', () => {
      renderAndTest(
        SYNTAX_IMPORT_MULTIPLE,
        {
          '@import': ['./some/path.css', './another/path.css'],
        },
        true,
      );
    });
  });

  describe('style sheet', () => {
    it('converts unified syntax to native syntax and transforms to a class name', () => {
      renderAndTest(SYNTAX_UNIFIED_LOCAL_FULL, {
        button: {
          margin: 0,
          padding: '6px 12px',
          border: '1px solid #2e6da4',
          borderRadius: 4,
          display: 'inline-block',
          cursor: 'pointer',
          fontFamily: 'Roboto',
          fontWeight: 'normal',
          lineHeight: 'normal',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          textAlign: 'center',
          backgroundColor: '#337ab7',
          verticalAlign: 'middle',
          color: 'rgba(0, 0, 0, 0)',
          animationName: '$fade',
          animationDuration: '.3s',
          '&:hover': {
            backgroundColor: '#286090',
            borderColor: '#204d74',
          },
          '&::before': {
            content: '"★"',
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: 5,
          },
          '@media (max-width: 600px)': {
            padding: '4px 8px',
          },
        },
      });
    });

    it('handles properties', () => {
      renderAndTest(SYNTAX_PROPERTIES, SYNTAX_PROPERTIES);
    });

    it('handles attribute selectors', () => {
      renderAndTest(SYNTAX_ATTRIBUTE, {
        attr: {
          display: 'block',
          '&[disabled]': {
            opacity: 0.5,
          },
        },
      });
    });

    it('handles descendant selectors', () => {
      renderAndTest(SYNTAX_DESCENDANT, {
        list: {
          margin: 0,
          padding: 0,
          '&> li': {
            listStyle: 'bullet',
          },
        },
      });
    });

    it('handles pseudo selectors', () => {
      renderAndTest(SYNTAX_PSEUDO, {
        pseudo: {
          position: 'fixed',
          '&:hover': {
            position: 'static',
          },
          '&::before': {
            position: 'absolute',
          },
        },
      });
    });

    it('handles multiple selectors (comma separated)', () => {
      renderAndTest(SYNTAX_MULTI_SELECTOR, {
        multi: {
          cursor: 'pointer',
          '&:disabled': { cursor: 'default' },
          '&[disabled]': { cursor: 'default' },
          '&> span': { cursor: 'default' },
        },
      });
    });

    it('handles @fallbacks', () => {
      renderAndTest(SYNTAX_FALLBACKS, {
        fallback: {
          background: 'linear-gradient(...)',
          display: 'flex',
          fallbacks: [
            { background: 'red' },
            { display: 'box' },
            { display: 'flex-box' },
            { color: 'blue' },
          ],
        },
      });
    });

    it('handles @media', () => {
      renderAndTest(SYNTAX_MEDIA_QUERY, {
        media: {
          color: 'red',
          '@media (max-width: 1000px)': {
            color: 'green',
          },
          '@media (min-width: 300px)': {
            color: 'blue',
          },
        },
      });
    });

    it('handles @supports', () => {
      renderAndTest(SYNTAX_SUPPORTS, {
        sup: {
          display: 'block',
          '@supports (display: flex)': {
            display: 'flex',
          },
          '@supports not (display: flex)': {
            float: 'left',
          },
        },
      });
    });
  });
});
