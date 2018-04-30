'use strict';

const {lstat: lstatCallback, stat: statCallback} = require('fs');
const {inspect, promisify} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const EMPTY_PATH_ERROR = 'Expected a file or directory path to get its mode';
const lstat = promisify(lstatCallback);
const stat = promisify(statCallback);

const confusingOptionNames = new Set([
	'followSymlink',
	'resolveSymlink',
	'resolveSymlinks'
]);

module.exports = async function getMode(...args) {
	const argLen = args.length;

	if (argLen !== 1 && argLen !== 2) {
		throw new TypeError(`Expected 1 or 2 arguments (path: <string|Buffer|URL>[, option: <Object>]), but got ${
			argLen === 0 ? 'no' : argLen
		} arguments.`);
	}

	const [path, option] = args;

	if (path === '') {
		throw new Error(`${EMPTY_PATH_ERROR}, but got '' (empty string).`);
	}

	if (Buffer.isBuffer(path) && path.length === 0) {
		throw new Error(`${EMPTY_PATH_ERROR}, but got an empty Buffer.`);
	}

	if (argLen === 1) {
		return (await lstat(path)).mode;
	}

	if (!isPlainObj(option)) {
		throw new TypeError(`Expected an object to specify whether \`followSymlinks\` option is enabled or not, but got ${
			inspectWithKind(option)
		}.`);
	}

	for (const optionName of confusingOptionNames) {
		const val = option[optionName];

		if (val !== undefined) {
			throw new Error(`\`${optionName}\` option is not supported but a value ${
				inspect(val)
			} was provided for it. You mistook \`followSymlinks\` as it.`);
		}
	}

	if (option.followSymlinks && typeof option.followSymlinks !== 'boolean') {
		throw new TypeError(`Expected \`followSymlinks\` option to be a Boolean value, but got ${
			inspectWithKind(option.followSymlinks)
		}.`);
	}

	return (await (option.followSymlinks ? stat : lstat)(path)).mode;
};
