import { Path } from '@boost/common';
import ConfigLoader from '../src/ConfigLoader';
import SystemDesign from '../src/SystemDesign';
import { SystemOptions, FONT_FAMILIES } from '../src';

describe('System', () => {
  const options: SystemOptions = {
    format: 'web-ts',
    platform: 'web',
  };

  describe('breakpoints', () => {
    it('handles mobile first', () => {
      const config = new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/mobile-first.yaml'),
      );

      const design = new SystemDesign('test', config, options);

      expect(design.template.breakpoint).toEqual({
        xs: {
          queryConditions: [['min-width', 640]],
          querySize: 640,
          rootLineHeight: 1.33375,
          rootTextSize: 14.937999999999999,
        },
        sm: {
          queryConditions: [['min-width', 960]],
          querySize: 960,
          rootLineHeight: 1.4231112499999998,
          rootTextSize: 15.938845999999998,
        },
        md: {
          queryConditions: [['min-width', 1280]],
          querySize: 1280,
          rootLineHeight: 1.5184597037499998,
          rootTextSize: 17.006748681999998,
        },
        lg: {
          queryConditions: [['min-width', 1600]],
          querySize: 1600,
          rootLineHeight: 1.6201965039012498,
          rootTextSize: 18.146200843693997,
        },
        xl: {
          queryConditions: [['min-width', 1920]],
          querySize: 1920,
          rootLineHeight: 1.7287496696626334,
          rootTextSize: 19.361996300221495,
        },
      });
    });

    it('handles desktop first', () => {
      const config = new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/desktop-first.yaml'),
      );

      const design = new SystemDesign('test', config, options);

      expect(design.template.breakpoint).toEqual({
        xs: {
          queryConditions: [['max-width', 640]],
          querySize: 640,
          rootLineHeight: 0.9038324214430207,
          rootTextSize: 10.122923120161829,
        },
        sm: {
          queryConditions: [['max-width', 960]],
          querySize: 960,
          rootLineHeight: 0.964389193679703,
          rootTextSize: 10.801158969212672,
        },
        md: {
          queryConditions: [['max-width', 1280]],
          querySize: 1280,
          rootLineHeight: 1.029003269656243,
          rootTextSize: 11.524836620149921,
        },
        lg: {
          queryConditions: [['max-width', 1600]],
          querySize: 1600,
          rootLineHeight: 1.0979464887232113,
          rootTextSize: 12.297000673699966,
        },
        xl: {
          queryConditions: [['max-width', 1920]],
          querySize: 1920,
          rootLineHeight: 1.1715089034676665,
          rootTextSize: 13.120899718837864,
        },
      });
    });
  });

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

  describe('themes', () => {
    it('loads a theme and all palette colors', () => {
      const config = new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/themes.yaml'),
      );

      const design = new SystemDesign('test', config, options);
      const theme = design.createTheme('default', config.themes.default);

      expect(theme.template).toMatchSnapshot();
    });

    it('supports theme extending', () => {
      const config = new ConfigLoader('web').load(
        new Path(__dirname, './__fixtures__/themes.yaml'),
      );

      const design = new SystemDesign('test', config, options);
      const base = design.createTheme('default', config.themes.default);
      const other = base.extend('other', config.themes.other, 'default');

      expect(other.template).toMatchSnapshot();
    });

    it('errors when theme doesnt implement the defined colors', () => {
      expect(() =>
        new ConfigLoader('web').load(
          new Path(__dirname, './__fixtures__/missing-theme-color.yaml'),
        ),
      ).toThrow(
        'Invalid field "themes.default.colors". Theme has not implemented the following colors: black, white',
      );
    });

    it('errors when theme implements an unknown colors', () => {
      expect(() =>
        new ConfigLoader('web').load(
          new Path(__dirname, './__fixtures__/unknown-theme-color.yaml'),
        ),
      ).toThrow('Invalid field "themes.default.colors". Theme is using unknown colors: white');
    });

    it('errors when theme implements too many color ranges', () => {
      expect(() =>
        new ConfigLoader('web').load(
          new Path(__dirname, './__fixtures__/invalid-palette-range.yaml'),
        ),
      ).toThrow('Unknown "themes.default.colors.black" fields: 100.');
    });

    it('errors when theme palette references an invalid color', () => {
      expect(() =>
        new ConfigLoader('web').load(
          new Path(__dirname, './__fixtures__/invalid-palette-color.yaml'),
        ),
      )
        .toThrow(`Invalid field "themes.default.palettes.brand". Type must be one of: string, shape. Received string with the following invalidations:
 - Invalid color "white".`);
    });

    it('errors when theme palette references an invalid color shade', () => {
      expect(() =>
        new ConfigLoader('web').load(
          new Path(__dirname, './__fixtures__/invalid-palette-color-reference.yaml'),
        ),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
