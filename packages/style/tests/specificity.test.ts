import Renderer from '../src/Renderer';
import getInsertedStyles from '../src/helpers/getInsertedStyles';
import purgeStyles from './purgeStyles';

describe('Selectors', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  afterEach(() => {
    purgeStyles('global');
    purgeStyles('standard');
    purgeStyles('conditions');
  });

  it('inserts declarations in the order they are defined', () => {
    renderer.renderRule({
      margin: 0,
      padding: 1,
      width: 50,
    });

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });

  it('inserts declarations in the order they are defined (reversed)', () => {
    renderer.renderRule({
      width: 50,
      padding: 1,
      margin: 0,
    });

    expect(getInsertedStyles('standard')).toMatchSnapshot();
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

    expect(getInsertedStyles('standard')).toMatchSnapshot();
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

    expect(getInsertedStyles('standard')).toMatchSnapshot();
  });
});
