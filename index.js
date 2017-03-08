/*!
 * get-mode | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/get-mode
*/
'use strict';

var inspect = require('util').inspect;

var fs = require('fs');
var isPlainObj = require('is-plain-obj');

var lstat = fs.lstat;
var stat = fs.stat;

var PATH_ERROR = 'Expected a file or directory path to get its mode';

var unsupportedOptions = [
  'followSymlink',
  'resolveSymlink',
  'resolveSymlinks'
];

module.exports = function getMode(path, option) {
  return new Promise(function(resolve, reject) {
    if (typeof path !== 'string') {
      throw new TypeError(PATH_ERROR + ', but got a non-string value ' + inspect(path) + '.');
    }

    if (path.length === 0) {
      throw new Error(PATH_ERROR + ', but got \'\' (empty string).');
    }

    if (option !== undefined) {
      if (!isPlainObj(option)) {
        throw new TypeError(
          'Expected an object to specify whether `followSymlinks` option is enabled or not, but got ' +
          inspect(option) +
          '.'
        );
      }

      for (var i = 0; i < unsupportedOptions.length; i++) {
        var val = option[unsupportedOptions[i]];

        if (option[unsupportedOptions[i]] !== undefined) {
          throw new Error(
            '`' + unsupportedOptions[i] + '` option is not supported but ' +
            inspect(val) +
            ' was provided for it. You mistook `followSymlinks` as it.'
          );
        }
      }

      if (option.followSymlinks && typeof option.followSymlinks !== 'boolean') {
        throw new TypeError(
          'Expected `followSymlinks` option to be a Boolean value, but got ' +
          inspect(option.followSymlinks) +
          '.'
        );
      }
    } else {
      option = {followSymlinks: false};
    }

    (option.followSymlinks ? stat : lstat)(path, function(err, result) {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.mode);
    });
  });
};
