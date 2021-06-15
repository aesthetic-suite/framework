import { ServerStyleEngine } from '../src';
import { createServerEngine, renderToStyleMarkup } from '../src/server';
import { purgeStyles } from '../src/test';

describe('Server', () => {
	let engine: ServerStyleEngine;

	beforeEach(() => {
		engine = createServerEngine();

		global.AESTHETIC_CUSTOM_ENGINE = engine;
		process.env.AESTHETIC_SSR = 'true';
	});

	afterEach(() => {
		purgeStyles();

		// @ts-expect-error Allow delete
		delete global.AESTHETIC_CUSTOM_ENGINE;
	});

	it('sets SSR global', () => {
		// @ts-expect-error Allow delete
		delete global.AESTHETIC_CUSTOM_ENGINE;

		engine.extractStyles();

		expect(global.AESTHETIC_CUSTOM_ENGINE).toBe(engine);
	});

	it('sets SSR env var', () => {
		delete process.env.AESTHETIC_SSR;

		engine.extractStyles();

		expect(process.env.AESTHETIC_SSR).toBe('true');
	});

	it('writes to a temporary style sheet implementation and generates accurate markup', () => {
		engine.setRootVariables({
			fontSize: '16px',
			bgColor: '#fff',
			fbColor: 'black',
		});

		engine.renderRule({
			margin: 0,
			padding: '6px 12px',
			border: '1px solid #2e6da4',
			borderRadius: '4px',
			display: 'inline-block',
			cursor: 'pointer',
			fontFamily: 'Roboto',
			fontWeight: 'normal',
			lineHeight: 'normal',
			whiteSpace: 'nowrap',
			textDecoration: 'none',
			textAlign: 'left',
			backgroundColor: '#337ab7',
			verticalAlign: 'middle',
			color: 'rgba(0, 0, 0, 0)',
			animationName: 'fade',
			animationDuration: '.3s',
		});

		engine.renderFontFace({
			fontFamily: '"Open Sans"',
			fontStyle: 'normal',
			fontWeight: 800,
			src: 'url("fonts/OpenSans-Bold.woff2")',
		});

		engine.renderRule({
			margin: 0,
			'@media': {
				'(width: 500px)': {
					margin: '10px',
					':hover': {
						color: 'red',
					},
					'@media': {
						'(width: 350px)': {
							'@supports': {
								'(color: blue)': {
									color: 'blue',
								},
							},
						},
					},
				},
			},
			'@supports': {
				'(color: green)': {
					color: 'green',
				},
			},
		});

		engine.renderKeyframes({
			from: {
				transform: 'translateX(0%)',
			},
			to: {
				transform: 'translateX(100%)',
			},
		});

		engine.renderImport({ path: 'test.css', url: true });

		// Test that conditions are merged
		engine.renderRule({
			margin: 0,
			'@media': {
				'(width: 500px)': {
					margin: '5px',
				},
			},
			'@supports': {
				'(color: green)': {
					color: 'black',
				},
			},
		});

		expect(renderToStyleMarkup(engine)).toMatchSnapshot();
	});

	it('can render media and feature queries', () => {
		engine.renderRule({
			'@media': {
				'(max-width: 1000px)': { display: 'block' },
			},
			'@supports': {
				'(display: flex)': { display: 'flex' },
			},
		});

		expect(renderToStyleMarkup(engine)).toMatchSnapshot();
	});

	it('merges conditionals instead of appending', () => {
		engine.renderRule({
			'@media': { '(max-width: 1000px)': { display: 'block' } },
		});
		engine.renderRule({
			'@media': { '(max-width: 1000px)': { display: 'inline-block' } },
		});
		engine.renderRule({
			'@media': { '(max-width: 1000px)': { display: 'flex' } },
		});

		expect(renderToStyleMarkup(engine)).toMatchSnapshot();
	});

	it('can render CSS variables', () => {
		engine.setRootVariables({
			'--root-level': 'true',
		});

		engine.renderRule({
			'@variables': {
				'--element-level': 123,
			},
		});

		engine.renderVariable('varLevel', '10px');

		expect(renderToStyleMarkup(engine)).toMatchSnapshot();
	});

	it('sorts media queries using mobile-first', () => {
		const block = { padding: 0 } as const;

		engine.renderRule({
			'@media': {
				'screen and (min-width: 1024px)': block,
				'screen and (min-width: 320px) and (max-width: 767px)': block,
				'screen and (min-width: 1280px)': block,
				'screen and (min-height: 480px)': block,
				'screen and (min-height: 480px) and (min-width: 320px)': block,
				'screen and (orientation: portrait)': block,
				'screen and (min-width: 640px)': block,
				print: block,
				'screen and (max-width: 767px) and (min-width: 320px)': block,
				tv: block,
				'screen and (max-height: 767px) and (min-height: 320px)': block,
				'screen and (orientation: landscape)': block,
				'screen and (min-device-width: 320px) and (max-device-width: 767px)': block,
				'screen and (max-width: 639px)': block,
				'screen and (max-width: 1023px)': block,
			},
		});

		expect(renderToStyleMarkup(engine)).toMatchSnapshot();
	});
});
