/* eslint-disable @typescript-eslint/no-misused-promises, jest/expect-expect */

import path from 'path';
import fs from 'fs-extra';
import { Compiler } from '../src';

const CONFIG_PATH = path.join(__dirname, './__fixtures__/system-scaled');

async function runCompilerSnapshot(filePath: string) {
	const files: { path: string; contents: string }[] = [];

	const mkdirSpy = jest.spyOn(fs, 'ensureDir').mockImplementation(() => Promise.resolve());

	const writeSpy = jest.spyOn(fs, 'writeFile').mockImplementation((fp, contents) => {
		files.push({
			path: String(fp),
			contents,
		});

		return Promise.resolve();
	});

	const compiler = new Compiler(filePath, __dirname, {
		format: 'web-tsx',
		platform: 'web',
	});

	await compiler.compile();

	// Sort files so that snapshots are deterministic
	files.sort((a, b) => a.path.localeCompare(b.path));

	files.forEach((file) => {
		expect(file.contents).toMatchSnapshot();
	});

	mkdirSpy.mockRestore();
	writeSpy.mockRestore();
}

describe('Compiler', () => {
	describe('constructor()', () => {
		it('errors if no config path', () => {
			expect(() => new Compiler('', '', { platform: 'web', format: 'web-jsx' })).toThrow(
				'A configuration folder path is required.',
			);
		});

		it('errors if config file is missing', () => {
			expect(() => new Compiler('./foo.yaml', '', { platform: 'web', format: 'web-jsx' })).toThrow(
				'File path "foo.yaml" does not exist.',
			);
		});

		it('errors if no target path', () => {
			expect(() => new Compiler(CONFIG_PATH, '', { platform: 'web', format: 'web-jsx' })).toThrow(
				'A target destination file path is required.',
			);
		});

		it('does not error if target path is missing', () => {
			expect(
				() =>
					new Compiler(CONFIG_PATH, './unknown-target', {
						platform: 'web',
						format: 'web-jsx',
					}),
			).not.toThrow();
		});

		it('errors for unknown platform', () => {
			expect(
				() =>
					new Compiler(CONFIG_PATH, './unknown-target', {
						// @ts-expect-error
						platform: 'osx',
						format: 'web-jsx',
					}),
			).toThrow('Invalid field "platform". String must be one of: android, ios, native, web');
		});

		it('errors for unknown target', () => {
			expect(
				() =>
					new Compiler(CONFIG_PATH, './unknown-target', {
						platform: 'web',
						// @ts-expect-error
						format: 'unknown',
					}),
			).toThrowErrorMatchingSnapshot();
		});
	});

	describe('compile()', () => {
		it('compiles all configs', async () => {
			await runCompilerSnapshot(CONFIG_PATH);
		});

		it('compiles design systems with multiple themes', async () => {
			await runCompilerSnapshot(path.join(__dirname, './__fixtures__/themes'));
		});
	});
});
