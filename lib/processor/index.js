'use strict';

const fs = require('fs'),
	consts = require('../consts'),
	algs = require('../algs'),
	utils = require('../utils');

// registers
let regs = {};

// command arguments
let arg1, arg2;

function init() {
	regs.ACC = 0x0;
	regs.GPR = 0x0;
	regs.PSW = 0x0;
	regs.CI = 0x0;
	regs.IC = 0x0;
	regs.IR = 0x0;

	// Set run bit
	regs.PSW = 0x01;
}

function load(file_path, start_ins_addr) {
	try {
		let progCode = fs.readFileSync(file_path);

		regs.CS = progCode.slice(0, consts.SEGMENT_SIZE);
		regs.DS = progCode.slice(consts.SEGMENT_SIZE);

		regs.IC = start_ins_addr || 0;

		return 0;
	} catch(err) {
		return -1;
	}
}

function interpret() {
	// Get next command
	regs.CI = get_next_code_byte();

	// Decode the command
	let cmd_type = algs.decode(regs.CI);

	// error
	if (!~cmd_type) {
		return -1;
	}

	// get arguments. Load arg1, arg2
	let args_count = get_args(cmd_type);

	//execute
	return execute_cmd(args_count);
}

function get_args(cmd_type) {
	let args_count = algs.get_cmd_args_count(cmd_type);

	if (args_count == 1) {
		arg1 = get_next_code_byte();
	} else if (args_count == 2) {
		arg1 = get_next_code_byte();
		arg2 = get_next_code_byte();
	}

	return args_count;
}

function execute_cmd(args_count) {
	utils.log('-------CMD--------\n');

	switch (regs.CI) {
		case consts.CMDS.NOP: {
			utils.log('NOP');
			break;
		}
		// math
		case consts.CMDS.ADD: {
			utils.log('ADD');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC += arg1;
			break;
		}
		case consts.CMDS.SUB: {
			utils.log('SUB');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC -= arg1;
			break;
		}
		case consts.CMDS.MUL: {
			utils.log('MUL');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC *= arg1;
			break;
		}
		case consts.CMDS.DIV: {
			utils.log('DIV');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC /= arg1;
			break;
		}
		case consts.CMDS.INC: {
			utils.log('INC');
			regs.ACC++;
			break;
		}
		case consts.CMDS.DEC: {
			utils.log('DEC');
			regs.ACC--;
			break;
		}
		// logical
		case consts.CMDS.AND: {
			utils.log('AND');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC &= arg1;
			break;
		}
		case consts.CMDS.XOR: {
			utils.log('XOR');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC ^= arg1;
			break;
		}
		case consts.CMDS.OR: {
			utils.log('INV');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC |= arg1;
			break;
		}
		case consts.CMDS.INV: {
			utils.log('INV');
			regs.ACC = ~regs.ACC;
			break;
		}
		// copy
		case consts.CMDS.MOV: {
			utils.log('MOV');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			utils.log('\targ2: ', algs.get_reg_name(arg2), '\n');
			regs[algs.get_reg_name(arg1)] = regs[algs.get_reg_name(arg2)];
			break;
		}
		case consts.CMDS.SET: {
			utils.log('SET');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC = arg1;
			break;
		}
		// transition
		case consts.CMDS.JMP: {
			utils.log('JMP');
			utils.log('\targ1: ', arg1, '\n');
			regs.IC = arg1;
			break;
		}
		case consts.CMDS.JIF: {
			utils.log('JIF');
			utils.log('\targ1: ', arg1, '\n');
			if (Boolean(regs.ACC)) {
				regs.IC = arg1;
			}
			break;
		}
		// input/output
		case consts.CMDS.IN: {
			utils.log('IN');
			utils.log('\targ1: ', arg1, '\n');
			regs.ACC = regs.DS[arg1];
			break;
		}
		case consts.CMDS.OUT: {
			utils.log('OUT');
			utils.log('\targ1: ', arg1, '\n');
			regs.DS[arg1] = regs.ACC;
			break;
		}
		case consts.CMDS.INR: {
			utils.log('INR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			utils.log('\targ1 value: ', regs[algs.get_reg_name(arg1)], '\n');
			regs.ACC = regs.DS[regs[algs.get_reg_name(arg1)]];
			break;
		}
		case consts.CMDS.OUTR: {
			utils.log('OUTR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			utils.log('\targ1 value: ', regs[algs.get_reg_name(arg1)], '\n');
			regs.DS[regs[algs.get_reg_name(arg1)]] = regs.ACC;
			break;
		}
		case consts.CMDS.ADDR: {
			utils.log('ADDR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			utils.log('\targ1 value: ', regs[algs.get_reg_name(arg1)], '\n');
			regs.ACC += regs[algs.get_reg_name(arg1)];
			break;
		}
		case consts.CMDS.SUBR: {
			utils.log('SUBR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			regs.ACC -= regs[algs.get_reg_name(arg1)];
			break;
		}
		case consts.CMDS.MULR: {
			utils.log('MULR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			regs.ACC *= regs[algs.get_reg_name(arg1)];
			break;
		}
		case consts.CMDS.DIVR: {
			utils.log('DIVR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			regs.ACC /= regs[algs.get_reg_name(arg1)];
			break;
		}
		case consts.CMDS.INCR: {
			utils.log('INCR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			regs[algs.get_reg_name(arg1)]++;
			break;
		}
		case consts.CMDS.DECR: {
			utils.log('DECR');
			utils.log('\targ1: ', algs.get_reg_name(arg1), '\n');
			regs[algs.get_reg_name(arg1)]--;
			break;
		}
		default: {
			return -1;
			break;
		}
	}

	utils.log('-------REGS-------\n');
	utils.log(`ACC: ${regs.ACC}\n`);
	utils.log(`GPR: ${regs.GPR}\n`);
	utils.log(`PSW: ${regs.PSW}\n`);
	utils.log(`CI: ${regs.CI}\n`);
	utils.log(`IC: ${regs.IC}\n`);
	utils.log(`IR: ${regs.IR}\n`);
	utils.log('-------END--------\n');

	return 0;
}

function loop() {
	let out = {};

	while (regs.PSW & 0x01 && (regs.IC < consts.SEGMENT_SIZE)) {
		if (!~interpret()) {
			out.error = `Cn\'t decode the command by index ${regs.IC}`;
			break;
		}
	}

	out.regs = regs;

	return out;
} 

function get_next_code_byte() {
	let cmd = regs.CS[regs.IC++];

	if (regs.IC >= consts.SEGMENT_SIZE) {
		regs.PSW = 0x00;
	}

	return cmd;
}

module.exports = {
	init,
	load,
	loop
};
