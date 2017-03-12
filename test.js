'use strict';

const getMode = require('.');
const {lstat, stat, symlink, unlink} = require('fs');
const runParallel = require('run-parallel');
const {test} = require('tap');

function runStatAndLstat(path, cb) {
  runParallel([
    done => stat(path, (err, {mode}) => done(err, mode)),
    done => lstat(path, (err, {mode}) => done(err, mode))
  ], cb);
}

test('get a file mode', t => {
  t.plan(5);

  symlink('index.js', 'tmp', symlinkErr => {
    t.equal(symlinkErr, null);

    getMode('tmp').then(mode => {
      runStatAndLstat('tmp', (err, [statMode, lstatMode]) => {
        t.equal(err, null);
        t.notEqual(statMode, mode);
        t.equal(lstatMode, mode);

        unlink('tmp', unlinkErr => t.is(unlinkErr, null));
      });
    }, t.error);
  });
});

test('`followSymlinks` option', t => {
  t.plan(5);

  symlink('index.js', '__tmp__', symlinkErr => {
    t.equal(symlinkErr, null);

    getMode('__tmp__', {followSymlinks: true}).then(mode => {
      runStatAndLstat('__tmp__', (err, [statMode, lstatMode]) => {
        t.equal(err, null);
        t.equal(statMode, mode);
        t.notEqual(lstatMode, mode);

        unlink('__tmp__', unlinkErr => t.is(unlinkErr, null));
      });
    }, t.error);
  });
});

test('be rejected on `lstat` failure', t => {
  return getMode('not/found').catch(({code, message, name}) => {
    t.equal(name, 'Error');
    t.equal(code, 'ENOENT');
    t.equal(message, 'ENOENT: no such file or directory, lstat \'not/found\'');
  });
});

test('invalidate non-string path', t => {
  return getMode([0]).catch(({message, name}) => {
    t.equal(name, 'TypeError');
    t.equal(
      message,
      'Expected a file or directory path to get its mode, but got a non-string value [ 0 ] (array).'
    );
  });
});

test('invalidate empty path', t => {
  return getMode('').catch(({message, name}) => {
    t.equal(name, 'Error');
    t.equal(
      message,
      'Expected a file or directory path to get its mode, but got \'\' (empty string).'
    );
  });
});

test('invalidate non-object option', t => {
  return getMode(__filename, Buffer.from('Hi')).catch(({message, name}) => {
    t.equal(name, 'TypeError');
    t.match(
      message,
      'whether `followSymlinks` option is enabled or not, but got <Buffer 48 69>.'
    );
  });
});

test('invalidate non-boolean `followSymlinks` option', t => {
  return getMode(__filename, {followSymlinks: new Uint8Array()}).catch(({message, name}) => {
    t.equal(name, 'TypeError');
    t.equal(
      message,
      'Expected `followSymlinks` option to be a Boolean value, but got Uint8Array [  ].'
    );
  });
});

test('invalidate unsupported option', t => {
  return getMode(__filename, {followSymlink: Promise.resolve(1)}).catch(({message, name}) => {
    t.equal(name, 'Error');
    t.equal(
      message,
      '`followSymlink` option is not supported but Promise { 1 } was provided for it. ' +
      'You mistook `followSymlinks` as it.'
    );
  });
});

test('no arguments', t => {
  return getMode().catch(({message, name}) => {
    t.equal(name, 'TypeError');
    t.equal(
      message,
      'Expected 1 or 2 arguments (path: String[, option: Object]), but got no arguments.'
    );
  });
});

test('toomany arguments', t => {
  return getMode('a', 'b', 'c').catch(({message, name}) => {
    t.equal(name, 'TypeError');
    t.equal(
      message,
      'Expected 1 or 2 arguments (path: String[, option: Object]), but got 3 arguments.'
    );
  });
});
