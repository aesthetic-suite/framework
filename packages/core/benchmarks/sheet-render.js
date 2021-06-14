const { objectLoop } = require('@aesthetic/utils');
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
// let counter = 0;

function getSheetParams() {
	// counter += 1;

	return {
		contrast: 'contrast',
		direction: 'ltr',
		scheme: 'light',
		theme: 'default',
		unit: 'px', // counter % 2 === 0 ? 'px' : () => 'em',
		vendor: false,
	};
}

// Cache using JSON.stringify
function cacheJSON(params) {
	return JSON.stringify(params);
}

suite.add('cacheJSON()', () => {
	cacheJSON(getSheetParams());
});

// Cache using Object.values
function cacheObjectValues(params) {
	return Object.values(params).join('');
}

suite.add('cacheObjectValues()', () => {
	cacheObjectValues(getSheetParams());
});

// Cache using Object.values only if theres no function
function cacheObjectValuesNoFunc(params) {
	const values = Object.values(params);

	if (typeof values[4] !== 'function') {
		return values.join('');
	}

	return '';
}

suite.add('cacheObjectValuesNoFunc()', () => {
	cacheObjectValuesNoFunc(getSheetParams());
});

// Cache using a custom object loop
function cacheObjectLoop(params) {
	let key = '';

	objectLoop(params, (value) => {
		key += value;
	});

	return key;
}

suite.add('cacheObjectLoop()', () => {
	cacheObjectLoop(getSheetParams());
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
