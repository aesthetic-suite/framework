import LocalParser from '../src/LocalParser';
import Block from '../src/Block';
import { Properties } from '../src/types';
import { createBlock } from './helpers';
import {
  KEYFRAMES_PERCENT,
  KEYFRAMES_RANGE,
  FONT_ROBOTO,
  FONTS_CIRCULAR,
  FONT_ROBOTO_FLAT_SRC,
  FONTS_CIRCULAR_FLAT_SRC,
} from './__mocks__/global';

describe('Special properties', () => {
  let parser: LocalParser<Properties>;
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
    parser = new LocalParser({
      onBlockProperty: spy,
    });
  });

  it('collapses `animation`', () => {
    parser.parseBlock(createBlock('animation'), {
      animation: {
        delay: '30ms',
        direction: 'normal',
        duration: '300ms',
        fillMode: 'both',
        iterationCount: 1,
        name: 'fade',
        playState: 'running',
        timingFunction: 'linear',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      expect.any(Block),
      'animation',
      '300ms linear 30ms 1 normal both running fade',
    );
  });

  it('parses `animationName` and renders keyframes', () => {
    let count = 0;

    // eslint-disable-next-line no-plusplus
    const kfSpy = jest.fn(() => `test${++count}`);

    parser.on('keyframes', kfSpy);
    parser.parseBlock(createBlock('animationName'), {
      animationName: ['slide', KEYFRAMES_PERCENT, KEYFRAMES_RANGE],
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'animationName', 'slide, test1, test2');

    expect(kfSpy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_PERCENT), undefined);

    expect(kfSpy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_RANGE), undefined);
  });

  it('collapses `background`', () => {
    parser.parseBlock(createBlock('background'), {
      background: {
        attachment: 'fixed',
        clip: 'border-box',
        color: 'black',
        image: 'none',
        origin: 'content-box',
        position: 'center',
        repeat: 'no-repeat',
        size: '50%',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      expect.any(Block),
      'background',
      'black none center / 50% no-repeat fixed border-box content-box',
    );
  });

  it('collapses `border`', () => {
    parser.parseBlock(createBlock('border'), {
      border: {
        color: 'red',
        style: 'solid',
        width: 1,
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'border', '1px solid red');
  });

  it('collapses `columnRule`', () => {
    parser.parseBlock(createBlock('columnRule'), {
      columnRule: {
        color: 'blue',
        style: 'dashed',
        width: 2,
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'columnRule', '2px dashed blue');
  });

  it('collapses `flex`', () => {
    parser.parseBlock(createBlock('flex'), {
      flex: {
        grow: 2,
        shrink: 1,
        basis: '50%',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'flex', '2 1 50%');
  });

  it('collapses `font`', () => {
    parser.parseBlock(createBlock('font'), {
      font: {
        family: '"Open Sans"',
        lineHeight: 1.5,
        size: 14,
        stretch: 'expanded',
        style: 'italic',
        variant: 'contextual',
        weight: 300,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      expect.any(Block),
      'font',
      'italic contextual 300 expanded 14px / 1.5 "Open Sans"',
    );
  });

  it('collapses `font` to system', () => {
    parser.parseBlock(createBlock('font'), {
      font: {
        family: '"Open Sans"',
        lineHeight: 1.5,
        size: 14,
        system: 'monospace',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'font', 'monospace');
  });

  it('parses `fontFamily` and renders font faces', () => {
    const ffSpy = jest.fn();

    parser.on('font-face', ffSpy);
    parser.parseBlock(createBlock('fontFamily'), {
      fontFamily: [FONT_ROBOTO, 'Arial', ...FONTS_CIRCULAR],
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'fontFamily', 'Roboto, Arial, Circular');

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

  it('collapses `listStyle`', () => {
    parser.parseBlock(createBlock('listStyle'), {
      listStyle: {
        image: 'inherit',
        position: 'outside',
        type: 'none',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'listStyle', 'none outside inherit');
  });

  it('formats `margin`', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: 5,
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'margin', '5px');
  });

  it('collapses `margin` (2-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        topBottom: '1px',
        leftRight: 2,
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'margin', '1px 2px');
  });

  it('collapses `margin` (3-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        bottom: '1px',
        leftRight: 3,
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'margin', '2px 3px 1px');
  });

  it('collapses `margin` (4-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        bottom: '1px',
        left: '3px',
        right: '4px',
        top: 2,
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'margin', '2px 4px 1px 3px');
  });

  it('collapses `offset`', () => {
    parser.parseBlock(createBlock('offset'), {
      offset: {
        distance: '40%',
        path: 'url(arc.svg)',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'offset', 'url(arc.svg) 40%');
  });

  it('collapses `offset` with rotate and position', () => {
    parser.parseBlock(createBlock('offset'), {
      offset: {
        path: 'url(arc.svg)',
        position: 'top',
        rotate: '90deg',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'offset', 'top url(arc.svg) 90deg');
  });

  it('collapses `offset` with anchor', () => {
    parser.parseBlock(createBlock('offset'), {
      offset: {
        anchor: 'left bottom',
        distance: '40%',
        path: 'url(arc.svg)',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'offset', 'url(arc.svg) 40% / left bottom');
  });

  it('collapses `outline`', () => {
    parser.parseBlock(createBlock('outline'), {
      outline: {
        color: 'green',
        style: 'dotted',
        width: '3px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'outline', '3px dotted green');
  });

  it('skips `padding`', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: '10px',
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', '10px');
  });

  it('collapses `padding` (2-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        topBottom: 1,
        leftRight: '2rem',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', '1px 2rem');
  });

  it('collapses `padding` (3-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        bottom: '1px',
        leftRight: '3px',
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', '2px 3px 1px');
  });

  it('collapses `padding` (4-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        bottom: 1,
        left: '3px',
        right: '4em',
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', '2px 4em 1px 3px');
  });

  it('collapses `textDecoration`', () => {
    parser.parseBlock(createBlock('textDecoration'), {
      textDecoration: {
        color: 'black',
        line: 'blink',
        style: 'dashed',
        thickness: 'from-font',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      expect.any(Block),
      'textDecoration',
      'blink dashed black from-font',
    );
  });

  it('collapses `transition`', () => {
    parser.parseBlock(createBlock('transition'), {
      transition: {
        delay: '10ms',
        duration: '200ms',
        property: 'color',
        timingFunction: 'ease-in',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'transition', 'color 200ms ease-in 10ms');
  });
});
