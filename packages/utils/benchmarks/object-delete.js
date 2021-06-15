const Benchmark = require('benchmark');
const { objectLoop } = require('../lib');

const suite = new Benchmark.Suite();

function createObject() {
	const object = {};

	for (let i = 0; i < 100; i += 1) {
		object[i] = i;
	}

	return object;
}

suite.add('deleteFromObject()', () => {
	const object = createObject();

	objectLoop(object, (value, key) => {
		if (Number(key) % 2 === 0) {
			delete object[key];
		}
	});
});

suite.add('createNewObject()', () => {
	const object = {};

	objectLoop(createObject(), (value, key) => {
		if (Number(key) % 2 !== 0) {
			object[key] = value;
		}
	});
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
