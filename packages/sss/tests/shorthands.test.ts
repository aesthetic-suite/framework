import LocalParser from '../src/LocalParser';
import Block from '../src/Block';
import { Properties } from '../src/types';
import { createBlock } from './helpers';

describe('Shorthand properties', () => {
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
        // iterationCount: 1,
        name: 'fade',
        playState: 'running',
        timingFunction: 'linear',
      },
    });

    expect(spy).toHaveBeenCalledWith(
      expect.any(Block),
      'animation',
      '300ms linear 30ms normal both running fade',
    );
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

  it('collapses `margin` (2-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        topBottom: '1px',
        leftRight: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'margin', '1px 2px');
  });

  it('collapses `margin` (3-sided)', () => {
    parser.parseBlock(createBlock('margin'), {
      margin: {
        bottom: '1px',
        leftRight: '3px',
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
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'margin', '2px 4px 1px 3px');
  });

  it('collapses `padding` (2-sided)', () => {
    parser.parseBlock(createBlock('padding'), {
      padding: {
        topBottom: '1px',
        leftRight: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', '1px 2px');
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
        bottom: '1px',
        left: '3px',
        right: '4px',
        top: '2px',
      },
    });

    expect(spy).toHaveBeenCalledWith(expect.any(Block), 'padding', '2px 4px 1px 3px');
  });
});
