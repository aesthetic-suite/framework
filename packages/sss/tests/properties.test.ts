import LocalParser from '../src/LocalParser';
import { Properties } from '../src/types';
import { createBlock } from './helpers';
import {
  KEYFRAMES_PERCENT,
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
      onBlock: spy,
    });
  });

  it('expands `animation`', () => {
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
      createBlock('animation', {
        animationDelay: '30ms',
        animationDirection: 'normal',
        animationDuration: '300ms',
        animationFillMode: 'both',
        animationIterationCount: 1,
        animationName: 'fade',
        animationPlayState: 'running',
        animationTimingFunction: 'linear',
      }),
    );
  });

  it('parses `animationName` and renders keyframes', () => {
    const kfSpy = jest.fn(() => 'test1');

    parser.on('keyframes', kfSpy);
    parser.parseBlock(createBlock('animationName'), {
      animationName: KEYFRAMES_PERCENT,
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('animationName', {
        animationName: 'test1',
      }),
    );

    expect(kfSpy).toHaveBeenCalledWith(createBlock('@keyframes', KEYFRAMES_PERCENT), undefined);
  });

  it('expands `background`', () => {
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
      createBlock('background', {
        backgroundAttachment: 'fixed',
        backgroundClip: 'border-box',
        backgroundColor: 'black',
        backgroundImage: 'none',
        backgroundOrigin: 'content-box',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50%',
      }),
    );
  });

  it('expands `border`', () => {
    parser.parseBlock(createBlock('border'), {
      border: {
        color: 'red',
        style: 'solid',
        width: 1,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('border', {
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 1,
      }),
    );
  });

  it('expands `columnRule`', () => {
    parser.parseBlock(createBlock('columnRule'), {
      columnRule: {
        color: 'blue',
        style: 'dashed',
        width: 2,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('columnRule', {
        columnRuleColor: 'blue',
        columnRuleStyle: 'dashed',
        columnRuleWidth: 2,
      }),
    );
  });

  it('expands `flex`', () => {
    parser.parseBlock(createBlock('flex'), {
      flex: {
        grow: 2,
        shrink: 1,
        basis: '50%',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('flex', {
        flexGrow: 2,
        flexShrink: 1,
        flexBasis: '50%',
      }),
    );
  });

  it('expands `font`', () => {
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
      createBlock('font', {
        fontFamily: '"Open Sans"',
        lineHeight: 1.5,
        fontSize: 14,
        fontStretch: 'expanded',
        fontStyle: 'italic',
        fontVariant: 'contextual',
        fontWeight: 300,
      }),
    );
  });

  it('expands `font` to system', () => {
    parser.parseBlock(createBlock('font'), {
      font: {
        family: '"Open Sans"',
        lineHeight: 1.5,
        size: 14,
        system: 'monospace',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('font', {
        font: 'monospace',
        lineHeight: 1.5,
      }),
    );
  });

  it('parses `fontFamily` and renders font faces', () => {
    const ffSpy = jest.fn((obj, fontFamily) => fontFamily || obj.fontFamily);

    parser.on('font-face', ffSpy);
    parser.parseBlock(createBlock('fontFamily'), {
      fontFamily: FONT_ROBOTO,
    });

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

    parser.on('font-face', ffSpy);
    parser.parseBlock(createBlock('fontFamily'), {
      fontFamily: [FONT_ROBOTO, 'Arial', ...FONTS_CIRCULAR],
    });

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

  it('expands `listStyle`', () => {
    parser.parseBlock(createBlock('listStyle'), {
      listStyle: {
        image: 'inherit',
        position: 'outside',
        type: 'none',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('listStyle', {
        listStyleImage: 'inherit',
        listStylePosition: 'outside',
        listStyleType: 'none',
      }),
    );
  });

  it('formats `margin`', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: 5,
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        margin: 5,
      }),
    );
  });

  it('expands `margin` (2-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        topBottom: '1px',
        leftRight: 2,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        marginTop: '1px',
        marginBottom: '1px',
        marginLeft: 2,
        marginRight: 2,
      }),
    );
  });

  it('expands `margin` (3-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        bottom: '1px',
        leftRight: 3,
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        marginTop: '2px',
        marginBottom: '1px',
        marginLeft: 3,
        marginRight: 3,
      }),
    );
  });

  it('expands `margin` (4-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        bottom: '1px',
        left: '3px',
        right: '4px',
        top: 2,
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        marginTop: 2,
        marginBottom: '1px',
        marginLeft: '3px',
        marginRight: '4px',
      }),
    );
  });

  it('expands `offset`', () => {
    parser.parseBlock(createBlock('offset'), {
      offset: {
        anchor: 'left bottom',
        distance: '40%',
        path: 'url(arc.svg)',
        position: 'top',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('offset', {
        offsetAnchor: 'left bottom',
        offsetDistance: '40%',
        offsetPath: 'url(arc.svg)',
        offsetPosition: 'top',
      }),
    );
  });

  it('expands `outline`', () => {
    parser.parseBlock(createBlock('outline'), {
      outline: {
        color: 'green',
        style: 'dotted',
        width: '3px',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('outline', {
        outlineColor: 'green',
        outlineStyle: 'dotted',
        outlineWidth: '3px',
      }),
    );
  });

  it('skips `padding`', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: '10px',
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        padding: '10px',
      }),
    );
  });

  it('expands `padding` (2-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        topBottom: 1,
        leftRight: '2rem',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }),
    );
  });

  it('expands `padding` (3-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        bottom: '1px',
        leftRight: '3px',
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        paddingTop: '2px',
        paddingBottom: '1px',
        paddingLeft: '3px',
        paddingRight: '3px',
      }),
    );
  });

  it('expands `padding` (4-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        bottom: 1,
        left: '3px',
        right: '4em',
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        paddingTop: '2px',
        paddingBottom: 1,
        paddingLeft: '3px',
        paddingRight: '4em',
      }),
    );
  });

  it('expands `textDecoration`', () => {
    parser.parseBlock(createBlock('textDecoration'), {
      textDecoration: {
        color: 'black',
        line: 'blink',
        style: 'dashed',
        thickness: 'from-font',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('textDecoration', {
        textDecorationColor: 'black',
        textDecorationLine: 'blink',
        textDecorationStyle: 'dashed',
        textDecorationThickness: 'from-font',
      }),
    );
  });

  it('expands `transition`', () => {
    parser.parseBlock(createBlock('transition'), {
      transition: {
        delay: '10ms',
        duration: '200ms',
        property: 'color',
        timingFunction: 'ease-in',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      createBlock('transition', {
        transitionDelay: '10ms',
        transitionDuration: '200ms',
        transitionProperty: 'color',
        transitionTimingFunction: 'ease-in',
      }),
    );
  });
});
