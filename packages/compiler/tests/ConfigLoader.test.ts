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
});
