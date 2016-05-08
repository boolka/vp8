#!/usr/bin/env node
'use strict';

const asm = require('../lib/assembler');

asm(process.argv[2], process.argv[3], err => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log('done');
});
