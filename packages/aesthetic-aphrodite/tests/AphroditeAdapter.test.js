import { expect } from 'chai';
import { StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import { StyleSheet as NoImpStyleSheet } from 'aphrodite/no-important';
import AphroditeAdapter from '../src/AphroditeAdapter';

describe('AphroditeAdapter', () => {
  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it('can customize the aphrodite instance through the constructor', () => {
    const extension = { selectorHandler() {} };
    const instance = new AphroditeAdapter(StyleSheet.extend([extension]));

    expect(instance.aphrodite).to.not.deep.equal(StyleSheet);
  });

  it('supports no important mode', () => {
    const instance = new AphroditeAdapter(NoImpStyleSheet);

    expect(instance.aphrodite).to.not.deep.equal(StyleSheet);
  });

  it('transforms style declarations into class names', () => {
    const instance = new AphroditeAdapter();

    expect(instance.transform('foo', {
      button: {
        display: 'inline-block',
        padding: 5,
      },
    })).to.deep.equal({
      button: 'button_sejigo',
    });
  });

  it('caches transformed style sheets', () => {
    const instance = new AphroditeAdapter();

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
          _definition: {
            display: 'inline-block',
            padding: 5,
          },
          _name: 'button_sejigo',
        },
        buttonGroup: {
          _definition: {
            display: 'flex',
          },
          _name: 'buttonGroup_poyjc',
        },
      },
      classNames: {
        button: 'button_sejigo',
        buttonGroup: 'buttonGroup_poyjc',
      },
    });
  });
});
