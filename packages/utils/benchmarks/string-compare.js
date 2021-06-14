/* eslint-disable unicorn/prefer-string-slice */

const Benchmark = require('benchmark');

const suite = new Benchmark.Suite();
const value = '@import "url.css"';

suite.add('startsWith()', () => {
	return value.startsWith('@import');
});

suite.add('slice()', () => {
	return value.slice(0, 7) === '@import';
});

suite.add('substr()', () => {
	return value.substr(0, 7) === '@import';
});

suite.add('substring()', () => {
	return value.substring(0, 7) === '@import';
});

const regex = /^@import/u;

suite.add('test()', () => {
	return regex.test(value);
});

suite.add('charAt()', () => {
	return value.charAt(0) === '@' && value.charAt(0) === 'i';
});

suite.add('charCodeAt()', () => {
	return value.charCodeAt(0) === 64 && value.charCodeAt(0) === 105;
});

suite.add('[]', () => {
	return value[0] === '@' && value[1] === 'i';
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
