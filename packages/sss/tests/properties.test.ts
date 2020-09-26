import setupDefaultOptions from '../src/helpers/setupDefaultOptions';
import parseBlock from '../src/parsers/parseBlock';
import { createBlock } from './helpers';
import {
  KEYFRAMES_PERCENT,
  KEYFRAMES_RANGE,
  FONT_ROBOTO,
  FONTS_CIRCULAR,
  FONT_ROBOTO_FLAT_SRC,
  FONTS_CIRCULAR_FLAT_SRC,
} from './__mocks__/global';

describe('Custom properties', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
  });

  it('parses `animationName` and renders keyframes', () => {
    const kfSpy = jest.fn(() => 'test1');

    parseBlock(
      createBlock('animationName'),
      {
        animationName: KEYFRAMES_PERCENT,
      },
      setupDefaultOptions({
        onBlock: spy,
        onKeyframes: kfSpy,
      }),
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('animationName', {
        animationName: 'test1',
      }),
    );
    expect(kfSpy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_PERCENT), '');
  });

  it('parses `animationName` as a list', () => {
    let count = 0;
    const kfSpy = jest.fn(() => {
      count += 1;

      return `test${count}`;
    });

    parseBlock(
      createBlock('animationName'),
      {
        animationName: [KEYFRAMES_PERCENT, 'global', KEYFRAMES_RANGE],
      },
      setupDefaultOptions({
        onBlock: spy,
        onKeyframes: kfSpy,
      }),
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('animationName', {
        animationName: 'test1, global, test2',
      }),
    );
    expect(kfSpy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_PERCENT), '');
    expect(kfSpy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_RANGE), '');
  });

  it('parses `fontFamily` and renders font faces', () => {
    const ffSpy = jest.fn((obj, fontFamily) => fontFamily || obj.fontFamily);

    parseBlock(
      createBlock('fontFamily'),
      {
        fontFamily: FONT_ROBOTO,
      },
      setupDefaultOptions({
        onBlock: spy,
        onFontFace: ffSpy,
      }),
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('fontFamily', {
        fontFamily: 'Roboto',
      }),
    );
    expect(ffSpy).toHaveBeenCalledWith(
      createBlock('@font-face', FONT_ROBOTO_FLAT_SRC),
      'Roboto',
      FONT_ROBOTO.srcPaths,
    );
  });

  it('parses `fontFamily` as a list', () => {
    const ffSpy = jest.fn((obj, fontFamily) => fontFamily || obj.fontFamily);

    parseBlock(
      createBlock('fontFamily'),
      {
        fontFamily: [FONT_ROBOTO, 'Arial', ...FONTS_CIRCULAR],
      },
      setupDefaultOptions({
        onBlock: spy,
        onFontFace: ffSpy,
      }),
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('fontFamily', {
        fontFamily: 'Roboto, Arial, Circular',
      }),
    );
    expect(ffSpy).toHaveBeenCalledWith(
      createBlock('@font-face', FONT_ROBOTO_FLAT_SRC),
      'Roboto',
      FONT_ROBOTO.srcPaths,
    );
    expect(ffSpy).toHaveBeenCalledWith(
      createBlock('@font-face', FONTS_CIRCULAR_FLAT_SRC[3]),
      'Circular',
      FONTS_CIRCULAR[3].srcPaths,
    );
  });
});
