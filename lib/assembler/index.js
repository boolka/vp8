'use strict';

const readline = require('readline'),
	consts = require('../consts'),
	algs = require('../algs'),
	utils = require('../utils'),
	fs = require('fs');

let code = new Buffer(consts.SEGMENT_SIZE),
	data = new Buffer(consts.SEGMENT_SIZE),
	code_index = 0,
	data_index = 0,
	cmd_count = 0;

code.fill(0x00);
data.fill(0x00);

module.exports = function(srcPath, dstPath, callback) {
	callback = callback || ()=>{};

	let src = fs.createReadStream(srcPath),
		dst = fs.createWriteStream(dstPath);

	const rl = readline.createInterface({
		input: src
	});

	rl.on('line', line => {
		let parsed_line = line.split(' '),
			cmd = parsed_line[0].toUpperCase(),
			cmd_type = algs.decode(consts.CMDS[cmd]);

		utils.log('Line: ', line);
		utils.log('Parsed line: ', parsed_line);
		utils.log('Command: ', cmd);
		utils.log('Command type: ', cmd_type);

		if (!~cmd_type) {
			callback(new Error('Cn\'t decode the command by index: ', code_index));
		}

		let instr_args_count = algs.get_cmd_args_count(cmd_type);

		utils.log('Instruction arguments count: ', instr_args_count);

		for (let i = 1; i <= instr_args_count; ++i) {
			utils.log(`Argument. Number ${i}: ${parsed_line[i]}`);
		}

		// Replace register names with the corresponding codes
		if (cmd_type == consts.CMD_TYPES.REGISTER_RWR || cmd_type == consts.CMD_TYPES.REGISTER_RWA || cmd_type ==  consts.CMD_TYPES.REGISTER_WR) {
			for (let i = 1; i <= instr_args_count; ++i) {
				let reg_code = consts.REGS[parsed_line[i].toUpperCase()];

				if (reg_code != null) {
					utils.log('Argument. Register code: ', reg_code);
					parsed_line[i] = reg_code;
				} else {
					callback(new Error(util.format(`Cn\'t decode the command by number ${cmd_count}, register name do not found ${parsed_line[i].toUpperCase()}`)));
				}
			}
		}

		// Write the cmd code
		code.writeUInt8(consts.CMDS[cmd], code_index++);

		// Write the arguments
		for (let i = 1; i <= instr_args_count; ++i) {
			code.writeUInt8(Number(parsed_line[i]), code_index++);
		}

		cmd_count++;
	});

	rl.on('close', () => {
		dst.end(Buffer.concat([code, data]), callback);
	});
};
