export default {
	module: '@beemo/dev',
	drivers: [
		['babel', { strategy: 'none' }],
		'eslint',
		'jest',
		'prettier',
		[
			'typescript',
			{
				buildFolder: 'dts',
				declarationOnly: true,
			},
		],
	],
	settings: {
		decorators: true,
		react: true,
	},
};
