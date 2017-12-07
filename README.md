# get-mode

[![npm version](https://img.shields.io/npm/v/get-mode.svg)](https://www.npmjs.com/package/get-mode)
[![Build Status](https://travis-ci.org/shinnn/get-mode.svg?branch=master)](https://travis-ci.org/shinnn/get-mode)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/get-mode.svg)](https://coveralls.io/github/shinnn/get-mode?branch=master)

A [Node.js](https://nodejs.org/) module to get a file mode

```javascript
const getMode = require('get-mode');

(async () => {
  const mode = getMode('index.js'); //=> 33188
  mode.toString(8); //=> '100644'
})();
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install get-mode
```

## API

```javascript
const getMode = require('get-mode');
```

### getMode(*path* [, *option*])

*path*: `string` (file, directory or symbolic link path)  
*option*: `Object`  
Return: `Promise<Integer>`

#### option.followSymlinks

Type: `boolean`  
Default: `false`

Whether to resolve all symbolic links before checking the mode, or get the mode of the symbolic link file itself.

```javascript
(async () => {
  (await getMode('./symlink-to-directory')).toString(8);
  //=> '120755'

  (await getMode('./symlink-to-directory', {followSymlinks: true})).toString(8);
  //=> '40755'
})();
```

## License

[ISC License](./LICENSE) © 2017 Shinnosuke Watanabe
