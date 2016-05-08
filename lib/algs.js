'use strict';

const consts = require('./consts');

function get_cmd_args_count(cmd_type) {
	for (let args_count in consts.CMD_ARGS_COUNT) {
		if (consts.CMD_ARGS_COUNT.hasOwnProperty(args_count)) {
			if (~consts.CMD_ARGS_COUNT[args_count].indexOf(cmd_type)) {
				return Number(args_count);
			}
		}
	}

	return -1;
}

function get_reg_name(code) {
	for (let reg_name in consts.REGS) {
		if (consts.REGS.hasOwnProperty(reg_name)) {
			if (consts.REGS[reg_name] == code) {
				return reg_name.toUpperCase();
			}
		}
	}

	return -1;
}

// Returns the command type
function decode(cmd_code) {
	for (let cmd_type in consts.CMDS_BY_TYPE) {
		if (consts.CMDS_BY_TYPE.hasOwnProperty(cmd_type)) {
			let cmd_index_by_type = consts.CMDS_BY_TYPE[cmd_type].indexOf(cmd_code);

			if (~cmd_index_by_type) {
				return consts.CMD_TYPES[cmd_type];
			}
		}
	}

	// Unrecognized command
	return -1;
}

module.exports = {
	get_reg_name,
	get_cmd_args_count,
	decode
};
