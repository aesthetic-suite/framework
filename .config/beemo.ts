export default {
	module: '@beemo/dev',
	drivers: [
		['babel', { configStrategy: 'none' }],
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
