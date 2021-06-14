const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
const selectorRegex = /^(:|\[|>|~|\+|\*|\|)/u;

function isSelectorRegex(value) {
	return selectorRegex.test(value);
}

suite.add('isSelectorRegex()', () => {
	isSelectorRegex('> {}');
	isSelectorRegex(':pseudo');
	isSelectorRegex('unknown');
});

function isSelectorSlice(value) {
	const char = value.slice(0, 1);

	return (
		char === ':' ||
		char === '[' ||
		char === '>' ||
		char === '~' ||
		char === '+' ||
		char === '*' ||
		char === '|'
	);
}

suite.add('isSelectorSlice()', () => {
	isSelectorSlice('> {}');
	isSelectorSlice(':pseudo');
	isSelectorSlice('unknown');
});

function isSelectorIndexAccess(value) {
	const char = value[0];

	return (
		char === ':' ||
		char === '[' ||
		char === '>' ||
		char === '~' ||
		char === '+' ||
		char === '*' ||
		char === '|'
	);
}

suite.add('isSelectorIndexAccess()', () => {
	isSelectorIndexAccess('> {}');
	isSelectorIndexAccess(':pseudo');
	isSelectorIndexAccess('unknown');
});

// Run all benchmarks
suite
	.on('cycle', function cycle(event) {
		console.log(String(event.target));
	})
	.on('complete', function complete() {
		console.log(`Fastest is ${this.filter('fastest').map('name')}`);
	})
	.run();
