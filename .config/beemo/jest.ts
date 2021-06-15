export default {
	coveragePathIgnorePatterns: ['system/src/mixins'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 90,
			statements: 90,
		},
	},
};
