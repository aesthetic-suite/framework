/* eslint-disable sort-keys */

module.exports = {
	ignore: ['scripts/'],
	rules: {
		'import/export': 'off',
		'node/no-missing-import': 'off',
		'prefer-object-spread': 'off',

		// We disable this for rollup
		'unicorn/import-index': 'off',
	},
	overrides: [
		{
			files: '*.ts',
			rules: {
				'@typescript-eslint/no-confusing-void-expression': 'off',
			},
		},
		{
			files: 'benchmarks/*.js',
			rules: {
				'no-console': 'off',
				'no-magic-numbers': 'off',
				'sort-keys': 'off',
				'babel/no-invalid-this': 'off',
				'import/no-extraneous-dependencies': 'off',
			},
		},
	],
};
