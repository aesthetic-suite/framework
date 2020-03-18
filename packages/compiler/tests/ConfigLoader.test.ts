import { Path } from '@boost/common';
import { ConfigLoader } from '../src';

describe('ConfigLoader', () => {
  it('handles scaling config', () => {
    expect(() =>
      new ConfigLoader('web').load(new Path(__dirname, '../templates/config.yaml')),
    ).not.toThrow();
  });

  it('handles fixed config', () => {
    expect(() =>
      new ConfigLoader('web').load(new Path(__dirname, '../templates/config-fixed.yaml')),
    ).not.toThrow();
  });

  it('errors if theme extends unknown theme', () => {
    expect(() =>
      new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/missing-theme-reference.yaml'),
      ),
    ).toThrow('Parent theme "unknown" does not exist.');
  });
});
