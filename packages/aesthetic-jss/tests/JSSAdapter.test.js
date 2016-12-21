import { expect } from 'chai';
import { create } from 'jss';
import JSSAdapter from '../src/JSSAdapter';

describe('JSSAdapter', () => {
  it('can customize the JSS instance through the constructor', () => {
    const jss = create();
    const instance = new JSSAdapter(jss);

    expect(instance.jss).to.equal(jss);
  });

  it('transforms style declarations into class names', () => {
    const instance = new JSSAdapter();

    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })).to.deep.equal({
      button: 'button-1157032238',
    });
  });

  it('caches transformed style sheets', () => {
    const instance = new JSSAdapter();

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
      sheet: instance.sheets.foo.sheet,
      classNames: {
        button: 'button-1157032238',
        buttonGroup: 'buttonGroup-4078521147',
      },
    });
  });
});
