'use strict';

const processor = require('./lib/processor'),
	assemble = require('./lib/assembler');

module.exports = {
	execute(path) {
		processor.init();
		if (!~processor.load(path)) {
			new Error('Cn\'t load program');
		}
		return processor.loop();
	},
	assemble
};
