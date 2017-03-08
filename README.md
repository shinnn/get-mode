# get-mode

[![NPM version](https://img.shields.io/npm/v/get-mode.svg)](https://www.npmjs.com/package/get-mode)
[![Build Status](https://travis-ci.org/shinnn/get-mode.svg?branch=master)](https://travis-ci.org/shinnn/get-mode)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/get-mode.svg)](https://coveralls.io/github/shinnn/get-mode?branch=master)

A [Node.js](https://nodejs.org/) module to get a file mode

```javascript
const getMode = require('get-mode');

getMode('index.js').then(mode => {
  mode; //=> 33188
  mode.toString(8); //=> '100644'
});
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install get-mode
```

## API

```javascript
const getMode = require('get-mode');
```

### getMode(*path* [, *option*])

*path*: `String` (file, directory or symbolic link path)  
*option*: `Object`  
Return: `Promise<Integer>`

#### option.followSymlinks

Type: `Boolean`  
Default: `false`

Whether to resolve all symbolic links before checking the mode, or get the mode of the symbolic link file itself.

```javascript
getMode('./symlink-to-directory').then(mode => {
  mode.toString(8); //=> '120755'
});

getMode('./symlink-to-directory', {followSymlinks: true}).then(mode => {
  mode.toString(8); //=> '40755'
});
```

## License

Copyright (c) 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
