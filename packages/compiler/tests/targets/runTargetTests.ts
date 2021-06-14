/* eslint-disable @typescript-eslint/no-misused-promises */

import path from 'path';
import fs from 'fs-extra';
import { Compiler, FormatType, PlatformType } from '../../src';

export default function runTargetTests(
	platform: PlatformType,
	format: FormatType,
	// Alternate testing fixed and scaled configs
	fixed: boolean = false,
) {
	describe(`Format ${format}`, () => {
		let compiler: Compiler;

		beforeEach(() => {
			compiler = new Compiler(
				path.join(__dirname, `../__fixtures__/${fixed ? 'system-fixed' : 'system-scaled'}`),
				__dirname,
				{
					format,
					platform,
				},
			);
		});

		it('compiles and writes files', async () => {
			const mkdirSpy = jest.spyOn(fs, 'ensureDir').mockImplementation(() => Promise.resolve());

			const writeSpy = jest.spyOn(fs, 'writeFile').mockImplementation((filePath, contents) => {
				expect(contents).toMatchSnapshot();

				return Promise.resolve();
			});

			await compiler.compile();

			expect(writeSpy).toHaveBeenCalledTimes(2);

			mkdirSpy.mockRestore();
			writeSpy.mockRestore();
		});
	});
}
