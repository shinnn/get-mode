/*!
 * get-mode | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/get-mode
*/
'use strict';

const fs = require('fs');

const lstat = fs.lstat;
const stat = fs.stat;

const inspectWithKind = require('inspect-with-kind');
const isPlainObj = require('is-plain-obj');

const PATH_ERROR = 'Expected a file or directory path to get its mode';

const confusingOptionNames = new Set([
  'followSymlink',
  'resolveSymlink',
  'resolveSymlinks'
]);

module.exports = function getMode(path, option) {
  return new Promise((resolve, reject) => {
    if (typeof path !== 'string') {
      throw new TypeError(`${PATH_ERROR}, but got a non-string value ${inspectWithKind(path)}.`);
    }

    if (path.length === 0) {
      throw new Error(`${PATH_ERROR}, but got '' (empty string).`);
    }

    if (option !== undefined) {
      if (!isPlainObj(option)) {
        throw new TypeError(
          `Expected an object to specify whether \`followSymlinks\` option is enabled or not, but got ${
            inspectWithKind(option)
          }.`
        );
      }

      for (const optionName of confusingOptionNames) {
        const val = option[optionName];

        if (val !== undefined) {
          throw new Error(`\`${optionName}\` option is not supported but ${
            inspectWithKind(val)
          } was provided for it. You mistook \`followSymlinks\` as it.`);
        }
      }

      if (option.followSymlinks && typeof option.followSymlinks !== 'boolean') {
        throw new TypeError(`Expected \`followSymlinks\` option to be a Boolean value, but got ${
          inspectWithKind(option.followSymlinks)
        }.`);
      }
    } else {
      option = {followSymlinks: false};
    }

    (option.followSymlinks ? stat : lstat)(path, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result.mode);
    });
  });
};
