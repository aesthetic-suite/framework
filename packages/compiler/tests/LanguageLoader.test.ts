import { Path } from '@boost/common';
import { LanguageLoader } from '../src';

describe('LanguageLoader', () => {
  it('handles scaled config', () => {
    expect(() =>
      new LanguageLoader('web').load(new Path(__dirname, './__fixtures__/system-scaled')),
    ).not.toThrow();
  });

  it('handles fixed config', () => {
    expect(() =>
      new LanguageLoader('web').load(new Path(__dirname, './__fixtures__/system-fixed')),
    ).not.toThrow();
  });
});
