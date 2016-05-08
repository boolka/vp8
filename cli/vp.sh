#!/usr/bin/env node
'use strict';

const vp = require('../lib/processor'),
	util = require('util');

vp.init();

if (!~vp.load(process.argv[2])) {
	console.error(`Cn\'t load the program by path: ${process.argv[2]}`);
}

let out = vp.loop();

process.stdout.write(util.inspect(bufferConvert(out), {
	colors: true
}) + '\n', 'utf8');

// more pretty out
function bufferConvert(obj) {
	for (let field in obj) {
		let value = obj[field];

		if (Buffer.isBuffer(value)) {
			// separate hexadecimal pairs
			obj[field] = value.toString('hex').split('').map( (char,i) => i % 2 ? char + ' ' : char ).join('');
		} else if (typeof value === 'object') {
			bufferConvert(value);
		}
	}

	return obj;
}
