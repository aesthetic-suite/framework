/* eslint-disable @typescript-eslint/camelcase */

import { Path } from '@boost/common';
import ConfigLoader from '../src/ConfigLoader';
import SystemDesign from '../src/SystemDesign';
import { SystemOptions, FONT_FAMILIES } from '../src';

describe('SystemDesign', () => {
  const options: SystemOptions = {
    platform: 'web',
    target: 'web-ts',
  };

  describe('typography', () => {
    it('sets each font', () => {
      const config = new ConfigLoader('web').load(new Path(__dirname, './__fixtures__/fonts.yaml'));

      const design = new SystemDesign('test', config, options);

      expect(design.template.typography.font).toEqual({
        text: 'Roboto, sans-serif',
        heading: 'Droid, sans-serif',
        monospace: '"Lucida Console", Monaco, monospace',
        system: FONT_FAMILIES['web-system'],
        locale: {
          ja_JP: 'YuGothic, "Meiryo UI", Meiryo, Osaka, Tahoma, Arial, sans-serif',
          th_TH: '"Leelawadee UI Regular", "Kmer UI", Tahoma, Arial, sans-serif',
        },
      });
    });

    it('sets heading and text font based on "system"', () => {
      const config = new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/system-font.yaml'),
      );

      const design = new SystemDesign('test', config, options);

      expect(design.template.typography.font.heading).toBe(FONT_FAMILIES['web-system']);
      expect(design.template.typography.font.text).toBe(FONT_FAMILIES['web-system']);
    });

    it('sets explicit heading and text font', () => {
      const config = new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/explicit-font.yaml'),
      );

      const design = new SystemDesign('test', config, options);

      expect(design.template.typography.font.heading).toBe('Roboto, "Open Sans"');
      expect(design.template.typography.font.text).toBe('Roboto, "Open Sans"');
    });
  });
});
