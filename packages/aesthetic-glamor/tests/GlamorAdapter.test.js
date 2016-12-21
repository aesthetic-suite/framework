import { expect } from 'chai';
import GlamorAdapter from '../src/GlamorAdapter';

describe('GlamorAdapter', () => {
  it('transforms style declarations into class names', () => {
    const instance = new GlamorAdapter();

    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })).to.deep.equal({
      button: 'foo-css-4czob7',
    });
  });

  it('caches transformed style sheets', () => {
    const instance = new GlamorAdapter();

    expect(instance.sheets.foo).to.be.an('undefined');

    instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
      buttonGroup: {
        display: 'flex',
      },
    });

    expect(instance.sheets.foo).to.deep.equal({
      sheet: {
        button: {
          'data-css-4czob7': '',
        },
        buttonGroup: {
          'data-css-1cqgl9p': '',
        },
      },
      classNames: {
        button: 'foo-css-4czob7',
        buttonGroup: 'foo-css-1cqgl9p',
      },
    });
  });
});
