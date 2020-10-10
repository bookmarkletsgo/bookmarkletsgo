#!/usr/bin/env node

'use strict';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });
const rollup = require('rollup');
const replace = require('@rollup/plugin-replace');
const { resolve } = require('path');
// const { readFile } = require('fs-extra');
const bookmarkleter = require('bookmarkleter');

function exit(err) {
  if (err) {
    console.error('\n' + err);

    process.exit(1);
  }

  process.exit();
}

async function bundle(filepath) {
  const inputOptions = {
    input: filepath,
    external: ['window', 'document', 'location', 'alert', 'console-error'],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
        'process.env.CUSTOM_SERVER_ORIGIN': JSON.stringify(
          process.env.CUSTOM_SERVER_ORIGIN
        )
      })
    ]
  };
  const outputOptions = {
    format: 'iife',
    interop: 'esModule',
    globals: {
      window: 'window',
      document: 'document',
      location: 'location',
      alert: 'alert',
      'console-error': 'console.error'
    }
  };
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);
  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects
  // console.log(bundle.watchFiles);
  // generate code
  const { output } = await bundle.generate(outputOptions);
  // console.log(code);
  // console.log(output[0].code);
  return output[0].code;
}

function preProcess(code) {
  code = code.replace(
    /process.env.NODE_ENV/g,
    `'${process.env.NODE_ENV || ''}'`
  );
  return code;
}

function postProcess(code) {
  /* eslint-disable no-script-url */
  // delete `'use strict';` after `javascript:`
  code = code.replace(
    "javascript:'use%20strict';void%20function",
    'javascript:void%20function'
  );
  code = code.replace(
    "javascript:'use strict';void function",
    'javascript:void function'
  );
  code = code.replace(
    "javascript:'use%20strict';(function",
    'javascript:(function'
  );
  code = code.replace(
    "javascript:'use strict';(function",
    'javascript:(function'
  );
  /* eslint-enable no-script-url */
  return code;
}

function main(filepath, options) {
  options = {
    urlencode: true,
    iife: false,
    transpile: true,
    minify: true,
    ...options
  };

  // return readFile(filepath, 'utf-8').then((originSrc) => {
  return bundle(filepath).then((originSrc) => {
    const bookmarkletSrc = postProcess(
      bookmarkleter(preProcess(originSrc), options)
    );
    return { originSrc, bookmarkletSrc };
  });
}

if (require.main === module) {
  const filename = process.argv.slice(2, 3)[0];
  if (!filename) {
    exit('Usage: node build.js FILENAME');
  }

  const filepath = resolve(process.cwd(), filename);
  const options = {
    urlencode: false,
    iife: false,
    transpile: true,
    minify: false
  };

  try {
    main(filepath, options)
      .then((result) => console.log(result.bookmarkletSrc))
      .catch(exit);
  } catch (error) {
    exit(error);
  }
} else {
  // Required as a module
  module.exports = main;
}
