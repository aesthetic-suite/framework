import { createTestEngine } from '../src/test';

describe('Test engine', () => {
	let engine: ReturnType<typeof createTestEngine>;

	beforeEach(() => {
		engine = createTestEngine();
	});

	describe('renderDeclaration()', () => {
		it('returns a fixed class name', () => {
			expect(engine.renderDeclaration('fontSize', 12)).toBe('property:font-size');
			// @ts-expect-error Allow hyphen name
			expect(engine.renderDeclaration('font-size', 12)).toBe('property:font-size');
		});
	});

	describe('renderFontFace()', () => {
		it('returns a fixed class name', () => {
			expect(engine.renderFontFace({})).toBe('font-face');
		});
	});

	describe('renderImport()', () => {
		it('returns a fixed class name', () => {
			expect(engine.renderImport('')).toBe('import');
		});
	});

	describe('renderKeyframes()', () => {
		it('returns a fixed class name', () => {
			expect(engine.renderKeyframes({})).toBe('keyframes:unknown');
			expect(engine.renderKeyframes({}, 'fade')).toBe('keyframes:fade');
		});
	});

	describe('renderRule()', () => {
		it('returns a fixed class name', () => {
			expect(
				engine.renderRule({
					display: 'block',
				}),
			).toEqual({ result: 'class', variants: [] });

			expect(
				engine.renderRule(
					{
						display: 'block',
					},
					{ debug: 'example' },
				),
			).toEqual({ result: 'example', variants: [] });
		});

		it('includes variables', () => {
			expect(
				engine.renderRule({
					display: 'block',
					'@variables': {
						fooBar: 123,
						'bar-baz': 456,
					},
				}),
			).toEqual({ result: 'class variable:foo-bar variable:bar-baz', variants: [] });
		});

		it('includes variants', () => {
			expect(
				engine.renderRule({
					display: 'block',
					'@variants': {
						'size:sm': {},
						'size:lg + fill:solid': {},
					},
				}),
			).toEqual({
				result: 'class',
				variants: [
					{
						result: 'variant:size:sm',
						types: ['size:sm'],
					},
					{
						result: 'variant:size:lg variant:fill:solid',
						types: ['size:lg', 'fill:solid'],
					},
				],
			});
		});
	});

	describe('renderRuleGrouped()', () => {
		it('returns a fixed class name', () => {
			expect(
				engine.renderRuleGrouped({
					display: 'block',
				}),
			).toEqual({ result: 'class', variants: [] });

			expect(
				engine.renderRuleGrouped(
					{
						display: 'block',
					},
					{ debug: 'example' },
				),
			).toEqual({ result: 'example', variants: [] });
		});

		it('includes variables', () => {
			expect(
				engine.renderRuleGrouped({
					display: 'block',
					'@variables': {
						fooBar: 123,
						'bar-baz': 456,
					},
				}),
			).toEqual({ result: 'class variable:foo-bar variable:bar-baz', variants: [] });
		});

		it('includes variants', () => {
			expect(
				engine.renderRuleGrouped({
					display: 'block',
					'@variants': {
						'size:sm': {},
						'size:lg + fill:solid': {},
					},
				}),
			).toEqual({
				result: 'class',
				variants: [
					{
						result: 'variant:size:sm',
						types: ['size:sm'],
					},
					{
						result: 'variant:size:lg variant:fill:solid',
						types: ['size:lg', 'fill:solid'],
					},
				],
			});
		});
	});

	describe('renderVariable()', () => {
		it('returns a fixed class name', () => {
			expect(engine.renderVariable('fontSize', 12)).toBe('variable:font-size');
			expect(engine.renderVariable('font-size', 12)).toBe('variable:font-size');
		});
	});
});
