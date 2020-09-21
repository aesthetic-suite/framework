/* eslint-disable sort-keys */

module.exports = {
  rules: {
    'import/export': 'off',
    'node/no-missing-import': 'off',
    'prefer-object-spread': 'off',

    // Broken
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
  },
  overrides: [
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
