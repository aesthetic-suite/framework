// Import for module augmentation
import '../src/types';
import { CustomProperties, StyleEngine } from '@aesthetic/style';
import { createTestStyleEngine, getRenderedStyles, purgeStyles } from '@aesthetic/style/test';
import { Properties } from '@aesthetic/types';
import { compoundProperties, expandedProperties } from '../src';

const customProperties = {
	...compoundProperties,
	...expandedProperties,
};

describe('Custom properties', () => {
	let engine: StyleEngine;

	function render<K extends keyof CustomProperties>(
		prop: K,
		value: CustomProperties[K] | Properties[K],
	) {
		engine.renderDeclaration(prop, value as any);
	}

	beforeEach(() => {
		engine = createTestStyleEngine({
			customProperties,
		});
	});

	afterEach(() => {
		purgeStyles();
	});

	it('supports `animation`', () => {
		render('animation', 'ease-in 200ms');

		render('animation', {
			delay: '30ms',
			direction: 'normal',
			duration: '300ms',
			fillMode: 'both',
			iterationCount: 1,
			name: 'fade',
			playState: 'running',
			timingFunction: 'linear',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `animationName`', () => {
		render('animationName', 'fade');

		render('animationName', { from: { opacity: 0 }, to: { opacity: 1 } });

		render('animationName', [
			{ from: { opacity: 0 }, to: { opacity: 1 } },
			{ '0%': { color: 'white' }, '100%': { color: 'black' } },
		]);

		expect(getRenderedStyles('global')).toMatchSnapshot();
		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `background`', () => {
		render('background', 'none');

		render('background', {
			attachment: 'fixed',
			clip: 'border-box',
			color: 'black',
			image: 'none',
			origin: 'content-box',
			position: 'center',
			repeat: 'no-repeat',
			size: '50%',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `border`', () => {
		render('border', 'transparent');

		render('border', {
			color: 'red',
			style: 'solid',
			width: 1,
		});

		render('borderTop', {
			color: 'red',
			style: 'solid',
			width: 1,
		});

		render('borderBottom', 0);

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `columnRule`', () => {
		render('columnRule', 'transparent');

		render('columnRule', {
			color: 'blue',
			style: 'dashed',
			width: 2,
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `flex`', () => {
		render('flex', 1);

		render('flex', {
			grow: 2,
			shrink: 1,
			basis: '50%',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `font`', () => {
		render('font', '1.2em "Fira Sans", sans-serif');

		render('font', {
			family: '"Open Sans"',
			lineHeight: 1.5,
			size: 14,
			stretch: 'expanded',
			style: 'italic',
			variant: 'contextual',
			weight: 300,
		});

		render('font', {
			family: '"Open Sans"',
			lineHeight: 1.5,
			size: 14,
			system: 'monospace',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `fontFamily`', () => {
		render('fontFamily', 'Roboto');

		render('fontFamily', { fontFamily: 'Roboto' });

		render('fontFamily', [{ fontFamily: 'Roboto' }, { fontFamily: '"Open Sans"' }]);

		expect(getRenderedStyles('global')).toMatchSnapshot();
		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `listStyle`', () => {
		render('listStyle', 'none');

		render('listStyle', {
			image: 'inherit',
			position: 'outside',
			type: 'none',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `margin`', () => {
		render('margin', 0);

		render('margin', {
			topBottom: '1px',
			leftRight: 2,
		});

		render('margin', {
			bottom: '1px',
			leftRight: 3,
			top: '2px',
		});

		render('margin', {
			bottom: '1px',
			left: '3px',
			right: '4px',
			top: 2,
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `offset`', () => {
		render('offset', 'none');

		render('offset', {
			anchor: 'left bottom',
			distance: '40%',
			path: 'url(arc.svg)',
			position: 'top',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `outline`', () => {
		render('outline', 'none');

		render('outline', {
			color: 'green',
			style: 'dotted',
			width: '3px',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `padding`', () => {
		render('padding', '10px');

		render('padding', {
			topBottom: 1,
			leftRight: '2rem',
		});

		render('padding', {
			bottom: '1px',
			leftRight: '3px',
			top: '2px',
		});

		render('padding', {
			bottom: 1,
			left: '3px',
			right: '4em',
			top: '2px',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `textDecoration`', () => {
		render('textDecoration', 'underline');

		render('textDecoration', {
			color: 'black',
			line: 'blink',
			style: 'dashed',
			thickness: 'from-font',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});

	it('supports `transition`', () => {
		render('transition', 'all 0s');

		render('transition', {
			delay: '10ms',
			duration: '200ms',
			property: 'color',
			timingFunction: 'ease-in',
		});

		expect(getRenderedStyles('standard')).toMatchSnapshot();
	});
});
