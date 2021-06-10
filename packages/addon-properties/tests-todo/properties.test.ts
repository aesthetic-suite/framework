// Import for module augmentation
import '../src/types';
import {
  Block,
  LocalStyleSheet,
  parse as doParse,
  ParserOptions,
  Properties,
} from '@aesthetic/sss';
import { expandedProperties as customProperties } from '../src';

function createBlock(selector: string, properties: object): Block<Properties> {
  const block = new Block('element');

  // @ts-expect-error
  block.properties = properties;

  return block;
}

function parse(styleSheet: LocalStyleSheet, options: ParserOptions<object>) {
  doParse('local', styleSheet, options);
}

describe('Custom properties', () => {
  let spy: jest.Mock;

  beforeEach(() => {
    spy = jest.fn();
  });

  it('handles normal `animation`', () => {
    parse(
      {
        element: {
          animation: 'ease-in 200ms',
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('animation', {
        animation: 'ease-in 200ms',
      }),
    );
  });

  it('parses expanded `animation`', () => {
    parse(
      {
        element: {
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
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

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

  it('parses expanded `background`', () => {
    parse(
      {
        element: {
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
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

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

  it('parses expanded `border`', () => {
    parse(
      {
        element: {
          border: {
            color: 'red',
            style: 'solid',
            width: 1,
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('border', {
        borderColor: 'red',
        borderStyle: 'solid',
        borderWidth: 1,
      }),
    );
  });

  it('parses expanded `columnRule`', () => {
    parse(
      {
        element: {
          columnRule: {
            color: 'blue',
            style: 'dashed',
            width: 2,
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('columnRule', {
        columnRuleColor: 'blue',
        columnRuleStyle: 'dashed',
        columnRuleWidth: 2,
      }),
    );
  });

  it('parses expanded `flex`', () => {
    parse(
      {
        element: {
          flex: {
            grow: 2,
            shrink: 1,
            basis: '50%',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('flex', {
        flexGrow: 2,
        flexShrink: 1,
        flexBasis: '50%',
      }),
    );
  });

  it('handles normal `font`', () => {
    parse(
      {
        element: {
          font: '1.2em "Fira Sans", sans-serif',
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('font', {
        font: '1.2em "Fira Sans", sans-serif',
      }),
    );
  });

  it('parses expanded `font`', () => {
    parse(
      {
        element: {
          font: {
            family: '"Open Sans"',
            lineHeight: 1.5,
            size: 14,
            stretch: 'expanded',
            style: 'italic',
            variant: 'contextual',
            weight: 300,
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

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

  it('parses expanded `font` to system', () => {
    parse(
      {
        element: {
          font: {
            family: '"Open Sans"',
            lineHeight: 1.5,
            size: 14,
            system: 'monospace',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('font', {
        font: 'monospace',
        lineHeight: 1.5,
      }),
    );
  });

  it('parses expanded `listStyle`', () => {
    parse(
      {
        element: {
          listStyle: {
            image: 'inherit',
            position: 'outside',
            type: 'none',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('listStyle', {
        listStyleImage: 'inherit',
        listStylePosition: 'outside',
        listStyleType: 'none',
      }),
    );
  });

  it('handles normal `margin`', () => {
    parse(
      {
        element: {
          margin: 5,
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        margin: 5,
      }),
    );
  });

  it('parses expanded `margin` (2-sided)', () => {
    parse(
      {
        element: {
          margin: {
            topBottom: '1px',
            leftRight: 2,
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        marginTop: '1px',
        marginBottom: '1px',
        marginLeft: 2,
        marginRight: 2,
      }),
    );
  });

  it('parses expanded `margin` (3-sided)', () => {
    parse(
      {
        element: {
          margin: {
            bottom: '1px',
            leftRight: 3,
            top: '2px',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        marginTop: '2px',
        marginBottom: '1px',
        marginLeft: 3,
        marginRight: 3,
      }),
    );
  });

  it('parses expanded `margin` (4-sided)', () => {
    parse(
      {
        element: {
          margin: {
            bottom: '1px',
            left: '3px',
            right: '4px',
            top: 2,
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('margin', {
        marginTop: 2,
        marginBottom: '1px',
        marginLeft: '3px',
        marginRight: '4px',
      }),
    );
  });

  it('parses expanded `offset`', () => {
    parse(
      {
        element: {
          offset: {
            anchor: 'left bottom',
            distance: '40%',
            path: 'url(arc.svg)',
            position: 'top',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('offset', {
        offsetAnchor: 'left bottom',
        offsetDistance: '40%',
        offsetPath: 'url(arc.svg)',
        offsetPosition: 'top',
      }),
    );
  });

  it('parses expanded `outline`', () => {
    parse(
      {
        element: {
          outline: {
            color: 'green',
            style: 'dotted',
            width: '3px',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('outline', {
        outlineColor: 'green',
        outlineStyle: 'dotted',
        outlineWidth: '3px',
      }),
    );
  });

  it('handles normal `padding`', () => {
    parse(
      {
        element: {
          padding: '10px',
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );
    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        padding: '10px',
      }),
    );
  });

  it('parses expanded `padding` (2-sided)', () => {
    parse(
      {
        element: {
          padding: {
            topBottom: 1,
            leftRight: '2rem',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        paddingTop: 1,
        paddingBottom: 1,
        paddingLeft: '2rem',
        paddingRight: '2rem',
      }),
    );
  });

  it('parses expanded `padding` (3-sided)', () => {
    parse(
      {
        element: {
          padding: {
            bottom: '1px',
            leftRight: '3px',
            top: '2px',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        paddingTop: '2px',
        paddingBottom: '1px',
        paddingLeft: '3px',
        paddingRight: '3px',
      }),
    );
  });

  it('parses expanded `padding` (4-sided)', () => {
    parse(
      {
        element: {
          padding: {
            bottom: 1,
            left: '3px',
            right: '4em',
            top: '2px',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('padding', {
        paddingTop: '2px',
        paddingBottom: 1,
        paddingLeft: '3px',
        paddingRight: '4em',
      }),
    );
  });

  it('parses expanded `textDecoration`', () => {
    parse(
      {
        element: {
          textDecoration: {
            color: 'black',
            line: 'blink',
            style: 'dashed',
            thickness: 'from-font',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(
      createBlock('textDecoration', {
        textDecorationColor: 'black',
        textDecorationLine: 'blink',
        textDecorationStyle: 'dashed',
        textDecorationThickness: 'from-font',
      }),
    );
  });

  it('parses expanded `transition`', () => {
    parse(
      {
        element: {
          transition: {
            delay: '10ms',
            duration: '200ms',
            property: 'color',
            timingFunction: 'ease-in',
          },
        },
      },
      {
        customProperties,
        onBlock: spy,
      },
    );

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
