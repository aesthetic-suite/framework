import { darkTheme } from '../src/testing';
import { MixinUtils } from '../src';

describe('Mixins', () => {
  const mixins: MixinUtils = darkTheme.toUtilities().mixin;

  describe('background', () => {
    it('renders background', () => {
      expect(mixins.background()).toMatchSnapshot();
      expect(mixins.background({ palette: 'brand' })).toMatchSnapshot();
      expect(mixins.background({ palette: 'danger' })).toMatchSnapshot();
    });

    it('errors for invalid `palette`', () => {
      expect(() =>
        mixins.background({
          // @ts-expect-error
          palette: 'unknown',
        }),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('border', () => {
    it('renders border', () => {
      expect(mixins.border()).toMatchSnapshot();
      expect(mixins.border({ size: 'sm', palette: 'info' })).toMatchSnapshot();
      expect(mixins.border({ size: 'lg', shade: '50', radius: false })).toMatchSnapshot();
    });

    it('errors for invalid `palette`', () => {
      expect(() =>
        mixins.border({
          size: 'sm',
          // @ts-expect-error
          palette: 'unknown',
        }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors for invalid `shade`', () => {
      expect(() =>
        mixins.border({
          size: 'sm',
          // @ts-expect-error
          shade: '99',
        }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors for invalid `size`', () => {
      expect(() =>
        mixins.border({
          // @ts-expect-error
          size: 'xl',
        }),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('foreground', () => {
    it('renders foreground', () => {
      expect(mixins.foreground()).toMatchSnapshot();
      expect(mixins.foreground({ palette: 'success' })).toMatchSnapshot();
      expect(mixins.foreground({ palette: 'warning' })).toMatchSnapshot();
    });

    it('errors for invalid `palette`', () => {
      expect(() =>
        mixins.foreground({
          // @ts-expect-error
          palette: 'unknown',
        }),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('display', () => {
    it('renders hide completely', () => {
      expect(mixins.hideCompletely()).toMatchSnapshot();
    });

    it('renders hide offscreen', () => {
      expect(mixins.hideOffscreen()).toMatchSnapshot();
    });

    it('renders hide visually', () => {
      expect(mixins.hideVisually()).toMatchSnapshot();
    });
  });

  describe('heading', () => {
    it('renders heading', () => {
      expect(mixins.heading()).toMatchSnapshot();
      expect(mixins.heading({ level: 3 })).toMatchSnapshot();
      expect(mixins.heading({ level: 6 })).toMatchSnapshot();
    });

    it('errors for invalid `level`', () => {
      expect(() =>
        mixins.heading({
          // @ts-expect-error
          level: 9,
        }),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('reset', () => {
    it('renders reset button', () => {
      expect(mixins.resetButton()).toMatchSnapshot();
      expect(mixins.resetButton({ flex: true })).toMatchSnapshot();
    });

    it('renders reset input', () => {
      expect(mixins.resetInput()).toMatchSnapshot();
    });

    it('renders reset list', () => {
      expect(mixins.resetList()).toMatchSnapshot();
    });

    it('renders reset media', () => {
      expect(mixins.resetMedia()).toMatchSnapshot();
    });

    it('renders reset typography', () => {
      expect(mixins.resetTypography()).toMatchSnapshot();
    });
  });

  describe('root', () => {
    it('renders root', () => {
      expect(mixins.root()).toMatchSnapshot();
    });
  });

  describe('shadow', () => {
    it('renders shadow', () => {
      expect(mixins.shadow()).toMatchSnapshot();
      expect(mixins.shadow({ size: 'sm', palette: 'info' })).toMatchSnapshot();
      expect(mixins.shadow({ size: 'lg', shade: '50' })).toMatchSnapshot();
    });

    it('errors for invalid `palette`', () => {
      expect(() =>
        mixins.shadow({
          size: 'sm',
          // @ts-expect-error
          palette: 'unknown',
        }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors for invalid `shade`', () => {
      expect(() =>
        mixins.shadow({
          size: 'sm',
          // @ts-expect-error
          shade: '99',
        }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('errors for invalid `size`', () => {
      expect(() =>
        mixins.shadow({
          // @ts-expect-error
          size: 'xxl',
        }),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('text', () => {
    it('renders text', () => {
      expect(mixins.text()).toMatchSnapshot();
      expect(mixins.text({ size: 'lg' })).toMatchSnapshot();
    });

    it('errors for invalid `size`', () => {
      expect(() =>
        mixins.text({
          // @ts-expect-error
          size: 'xl',
        }),
      ).toThrowErrorMatchingSnapshot();
    });

    it('renders text break', () => {
      expect(mixins.textBreak()).toMatchSnapshot();
    });

    it('renders text truncate', () => {
      expect(mixins.textTruncate()).toMatchSnapshot();
    });

    it('renders text wrap', () => {
      expect(mixins.textWrap()).toMatchSnapshot();
    });
  });
});
