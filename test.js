'use strict';

const {lstat, stat, symlink, unlink} = require('fs').promises;
const {join} = require('path');

const getMode = require('.');
const test = require('tape');

test('getMode()', t => {
	t.plan(3);

	(async () => {
		const tmp = join(__dirname, 'tmp');

		await symlink(__filename, tmp);
		const [actual, {mode: expected}] = await Promise.all([getMode(tmp), lstat(tmp)]);

		t.equal(
			actual,
			expected,
			'should get a file mode.'
		);

		return unlink(tmp);
	})();

	(async () => {
		const tmp = join(__dirname, '__tmp__');

		await symlink(__filename, tmp);
		const [actual, {mode: expected}] = await Promise.all([
			getMode(tmp, {followSymlinks: true}),
			stat(tmp)
		]);

		t.equal(
			actual,
			expected,
			'should resolve symlinks when `followSymlinks` option is enabled.'
		);

		return unlink(tmp);
	})();

	(async () => {
		try {
			await getMode('not/found', {});
		} catch ({code}) {
			t.equal(code, 'ENOENT', 'should fail when it cannot get file stats.');
		}
	})();
});

test('Argument validation', async t => {
	try {
		await getMode([0]);
	} catch ({code}) {
		t.equal(code, 'ERR_INVALID_ARG_TYPE', 'should invalidate non-path first argument.');
	}

	try {
		await getMode('');
	} catch ({message}) {
		t.equal(
			message,
			'Expected a file or directory path to get its mode, but got \'\' (empty string).',
			'should invalidate empty string path.'
		);
	}

	try {
		await getMode(Buffer.alloc(0));
	} catch ({message}) {
		t.equal(
			message,
			'Expected a file or directory path to get its mode, but got an empty Buffer.',
			'should invalidate empty Buffer path.'
		);
	}

	try {
		await getMode(__filename, Buffer.from('a'));
	} catch ({message}) {
		t.equal(
			message,
			'Expected an object to specify whether `followSymlinks` option is enabled or not, but got <Buffer 61>.',
			'should invalidate invalidate non-object options.'
		);
	}

	try {
		await getMode(__filename, {followSymlinks: new Uint8Array()});
	} catch ({message}) {
		t.equal(
			message,
			'Expected `followSymlinks` option to be a Boolean value, but got Uint8Array [  ].',
			'should invalidate non-boolean `followSymlinks` option.'
		);
	}

	try {
		await getMode(__filename, {followSymlink: -0});
	} catch ({message}) {
		t.equal(
			message,
			'`followSymlink` option is not supported but a value -0 was provided for it. You mistook `followSymlinks` as it.',
			'should invalidate unsupported options.'
		);
	}

	try {
		await getMode();
	} catch ({message}) {
		t.equal(
			message,
			'Expected 1 or 2 arguments (path: <string|Buffer|URL>[, option: <Object>]), but got no arguments.',
			'should invalidate zero-length arguments.'
		);
	}

	try {
		await getMode('_', {}, '_');
	} catch ({message}) {
		t.equal(
			message,
			'Expected 1 or 2 arguments (path: <string|Buffer|URL>[, option: <Object>]), but got 3 arguments.',
			'should invalidate too many arguments.'
		);
	}

	t.end();
});
