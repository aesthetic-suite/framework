import Renderer from '../src/client/ClientRenderer';
import { getRenderedStyles, purgeStyles } from '../src/testing';

describe('Specificity', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  afterEach(() => {
    purgeStyles();
  });

  it('inserts declarations in the order they are defined', () => {
    renderer.renderRule({
      margin: 0,
      padding: '1px',
      width: '50px',
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts declarations in the order they are defined (reversed)', () => {
    renderer.renderRule({
      width: '50px',
      padding: '1px',
      margin: 0,
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts selectors in the order they are defined', () => {
    renderer.renderRule({
      color: 'white',
      ':active': {
        color: 'red',
      },
      ':hover': {
        color: 'blue',
      },
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });

  it('inserts selectors in the order they are defined (reversed)', () => {
    renderer.renderRule({
      color: 'white',
      ':hover': {
        color: 'blue',
      },
      ':active': {
        color: 'red',
      },
    });

    expect(getRenderedStyles('standard')).toMatchSnapshot();
  });
});
