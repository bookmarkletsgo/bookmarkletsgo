#!/usr/bin/env node

'use strict';

const { resolve } = require('path');
const { readFile } = require('fs-extra');
const bookmarkleter = require('bookmarkleter');

function exit(err) {
  if (err) {
    console.error('\n' + err);

    process.exit(1);
  }

  process.exit();
}

function main(filepath) {
  const options = {
    urlencode: true,
    iife: true,
    transpile: true,
    minify: true
  };
  return readFile(filepath, 'utf-8').then((originSrc) => {
    originSrc = originSrc.replace(
      /process.env.NODE_ENV/g,
      `'${process.env.NODE_ENV || ''}'`
    );
    const bookmarkletSrc = bookmarkleter(originSrc, options);
    return { originSrc, bookmarkletSrc };
  });
}

if (require.main === module) {
  const filename = process.argv.slice(2, 3)[0];
  if (!filename) {
    exit('Usage: node build.js FILENAME');
  }

  const filepath = resolve(process.cwd(), filename);

  try {
    main(filepath)
      .then((result) => console.log(result.bookmarkletSrc))
      .catch(exit);
  } catch (error) {
    exit(error);
  }
} else {
  // Required as a module
  module.exports = main;
}
