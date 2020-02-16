import Renderer from '../src/Renderer';
import getInsertedStyles from '../src/helpers/getInsertedStyles';
import purgeStyles from './purgeStyles';

describe('Styles', () => {
  let renderer: Renderer;
  let spy: jest.SpyInstance;

  beforeEach(() => {
    renderer = new Renderer();

    // Avoid warnings
    spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    spy.mockRestore();

    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  });

  it('generates a unique class name for each property', () => {
    const className = renderer.renderRule({
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
      textAlign: 'left',
      backgroundColor: '#337ab7',
      verticalAlign: 'middle',
      color: 'rgba(0, 0, 0, 0)',
      animationName: 'fade',
      animationDuration: '.3s',
    });

    expect(className).toBe(
      '13kbekr fj61tt 1pue5r2 odvm0w 169hbqq 16r1ggk 1c05vza 16weknc wyq6ru 1a0rdy6 1dh7ri5 1sl4fpf 9tlqaj g4y2l6 1o2fiv7 1ql63jz rwfe5q',
    );
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('generates a unique class name for each selector even if property value pair is the same', () => {
    const className = renderer.renderRule({
      background: '#000',
      ':hover': {
        background: '#000',
      },
      '[disabled]': {
        background: '#000',
      },
    });

    expect(className).toBe('1yedsjc yb3jac ooy7ta');
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for the same property value pair', () => {
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'block');
    renderer.renderDeclaration('display', 'flex');
    renderer.renderDeclaration('display', 'inline');
    renderer.renderDeclaration('display', 'block');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for dashed and camel cased properties', () => {
    renderer.renderDeclaration('textDecoration', 'none');
    renderer.renderDeclaration('text-decoration', 'none');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('uses the same class name for numeric and string values', () => {
    renderer.renderDeclaration('width', 100);
    renderer.renderDeclaration('width', '100px');
    renderer.renderDeclaration('width', '100em');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('applies a px unit to numeric properties that require it', () => {
    renderer.renderDeclaration('width', 300);
    renderer.renderDeclaration('marginTop', 10);

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('doesnt apply a px unit to numeric properties that dont require it', () => {
    renderer.renderDeclaration('lineHeight', 1.5);
    renderer.renderDeclaration('fontWeight', 600);

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('doesnt apply a px unit to properties that are already prefixed', () => {
    renderer.renderDeclaration('paddingLeft', '10px');
    renderer.renderDeclaration('height', '10vh');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('supports CSS variables within values', () => {
    renderer.renderDeclaration('color', 'var(--primary-color)');
    renderer.renderDeclaration('border', '1px solid var(--border-color)');

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('can nest conditionals infinitely', () => {
    renderer.renderRule({
      margin: 0,
      '@media (width: 500px)': {
        margin: 10,
        ':hover': {
          color: 'red',
        },
        '@media (width: 350px)': {
          '@supports (color: blue)': {
            color: 'blue',
          },
        },
      },
    });

    expect(getInsertedStyles('standard')).toMatchSnapshot();
    expect(getInsertedStyles('conditions')).toMatchSnapshot();
  });

  it('ignores invalid values', () => {
    const className = renderer.renderRule({
      // @ts-ignore
      margin: true,
      // @ts-ignore
      padding: null,
      // @ts-ignore
      color: undefined,
    });

    expect(className).toBe('');
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('inserts into the appropriate style sheets', () => {
    renderer.renderRule({
      background: 'white',
      '@media (prefers-color-scheme: dark)': {
        background: 'black',
      },
    });

    renderer.renderImport('url(test.css)');

    expect(getInsertedStyles('global')).toMatchSnapshot();
    expect(getInsertedStyles('standard')).toMatchSnapshot();
    expect(getInsertedStyles('conditions')).toMatchSnapshot();
  });

  it('logs a warning for unknown property values', () => {
    renderer.renderRule({
      // @ts-ignore
      color: true,
    });

    expect(spy).toHaveBeenCalledWith('Invalid value "true" for property "color".');
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('logs a warning for unknown nested selector', () => {
    renderer.renderRule({
      background: 'white',
      '$ what is this': {
        background: 'black',
      },
    });

    expect(spy).toHaveBeenCalledWith('Unknown property selector or nested block "$ what is this".');
    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });
});
