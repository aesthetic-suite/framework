import { Path } from '@boost/common';
import LanguageLoader from '../src/LanguageLoader';
import ThemesLoader from '../src/ThemesLoader';
import SystemDesign from '../src/SystemDesign';
import { SystemOptions, FONT_FAMILIES } from '../src';

describe('System', () => {
  const options: SystemOptions = {
    format: 'web-tsx',
    platform: 'web',
  };

  describe('breakpoints', () => {
    it('handles mobile first', () => {
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/system-fixed/language.yaml'),
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
  });

  describe('typography', () => {
    it('sets each font', () => {
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/fonts.yaml'),
      );

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
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/system-font.yaml'),
      );

      const design = new SystemDesign('test', config, options);

      expect(design.template.typography.font.heading).toBe(FONT_FAMILIES['web-system']);
      expect(design.template.typography.font.text).toBe(FONT_FAMILIES['web-system']);
    });

    it('sets explicit heading and text font', () => {
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/explicit-font.yaml'),
      );

      const design = new SystemDesign('test', config, options);

      expect(design.template.typography.font.heading).toBe('Roboto, "Open Sans"');
      expect(design.template.typography.font.text).toBe('Roboto, "Open Sans"');
    });
  });

  describe('themes', () => {
    it('loads a theme and all palette colors', () => {
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/colors.yaml'),
      );

      const themes = new ThemesLoader(config.colors).load(
        new Path(__dirname, './__fixtures__/themes/themes.yaml'),
      );

      const design = new SystemDesign('test', config, options);
      const theme = design.createTheme('default', themes.themes.default);

      expect(theme.template).toMatchSnapshot();
    });

    it('supports theme extending', () => {
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/colors.yaml'),
      );

      const themes = new ThemesLoader(config.colors).load(
        new Path(__dirname, './__fixtures__/themes/themes.yaml'),
      );

      const design = new SystemDesign('test', config, options);
      const base = design.createTheme('default', themes.themes.default);
      const other = base.extend('other', themes.themes.other, 'default');

      expect(other.template).toMatchSnapshot();
    });

    it('supports palettes with different combinations of color and shade settings', () => {
      const config = new LanguageLoader('web').load(
        new Path(__dirname, './__fixtures__/colors.yaml'),
      );

      const themes = new ThemesLoader(config.colors).load(
        new Path(__dirname, './__fixtures__/themes/theme-palette-settings.yaml'),
      );

      const design = new SystemDesign('test', config, options);
      const theme = design.createTheme('default', themes.themes.default);

      expect(theme.template).toMatchSnapshot();
    });

    it('errors when theme doesnt implement the defined colors', () => {
      expect(() =>
        new ThemesLoader(['black', 'white']).load(
          new Path(__dirname, './__fixtures__/themes/missing-theme-color.yaml'),
        ),
      ).toThrow(
        'Invalid field "themes.default.colors". Theme has not implemented the following colors: black, white',
      );
    });

    it('errors when theme implements an unknown colors', () => {
      expect(() =>
        new ThemesLoader(['black']).load(
          new Path(__dirname, './__fixtures__/themes/unknown-theme-color.yaml'),
        ),
      ).toThrow('Invalid field "themes.default.colors". Theme is using unknown colors: white');
    });

    it('errors when theme implements too many color ranges', () => {
      expect(() =>
        new ThemesLoader(['black']).load(
          new Path(__dirname, './__fixtures__/themes/invalid-palette-range.yaml'),
        ),
      ).toThrow('Unknown "themes.default.colors.black" fields: 100.');
    });

    it('errors when theme palette references an invalid color', () => {
      expect(() =>
        new ThemesLoader(['black']).load(
          new Path(__dirname, './__fixtures__/themes/invalid-palette-color.yaml'),
        ),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors when theme palette references an invalid color shade', () => {
      expect(() =>
        new ThemesLoader(['black']).load(
          new Path(__dirname, './__fixtures__/themes/invalid-palette-color-reference.yaml'),
        ),
      ).toThrowErrorMatchingSnapshot();
    });
  });
});
