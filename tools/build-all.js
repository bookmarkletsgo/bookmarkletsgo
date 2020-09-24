#!/usr/bin/env node

'use strict';

const { resolve } = require('path');
const {
  readdir,
  stat,
  readFile,
  writeFile,
  ensureDirSync,
  copyFileSync,
  removeSync
} = require('fs-extra');
const buildBookmarklet = require('./build-bookmarklet.js');
const WORKING_DIR = process.cwd();
const htmlTemplteFilepath = resolve(WORKING_DIR, 'src/bookmarklets.html');
const jsFilepath = resolve(WORKING_DIR, 'src/bookmarklets.js');
const distFilepath = resolve(WORKING_DIR, 'public/bookmarklets.html');

function exit(err) {
  if (err) {
    console.error('');
    console.error(err);
    console.error('^^^^');
    process.exit(1);
  }

  process.exit();
}

function readPackageInformation(filepath) {
  return readFile(filepath, 'utf-8')
    .then(JSON.parse)
    .then((info) => {
      if (!info.name) {
        throw new TypeError('Bookmarklet name is required! ' + filepath);
      }

      return info;
    });
}

function buildHtml(bookmarklets) {
  const list = bookmarklets
    .sort((a, b) => {
      if (a._id === 'main') {
        return -1;
      }

      if (b._id === 'main') {
        return 1;
      }

      return a.name.localeCompare(b.name);
    })
    .map(
      (bookmarklet) =>
        `<li><a id="bookmarkletsgo_${bookmarklet._id}" href="${
          bookmarklet.bookmarkletSrc
        }">${bookmarklet.title || bookmarklet.name}</a></li>`
    );

  return Promise.all([
    readFile(htmlTemplteFilepath, 'utf-8'),
    readFile(jsFilepath, 'utf-8')
  ])
    .then(([htmlTemplate, script]) =>
      htmlTemplate
        .replace('{bookmarklets}', list.join(''))
        .replace('{bookmarkletsScript}', script)
    )
    .then((content) => writeFile(distFilepath, content));
}

function loadPackages(dirname) {
  return readdir(dirname).then((list) => {
    return Promise.all(
      list.map((file) => {
        const subDirpath = resolve(dirname, file);
        return stat(subDirpath).then((stats) => {
          if (stats && stats.isDirectory()) {
            console.info('load package: ' + file);

            return Promise.all([
              readPackageInformation(resolve(subDirpath, 'package.json')),
              buildBookmarklet(resolve(subDirpath, 'index.js'))
            ]).then(([content, bookmarklet]) => ({
              ...content,
              ...bookmarklet,
              ...{ _id: file }
            }));
          }
        });
      })
    ).then((value) => value.filter((v) => Boolean(v)));
  });
}

// Main
try {
  if (process.env.NODE_ENV === 'production') {
    removeSync(resolve(WORKING_DIR, 'public'));
    ensureDirSync(resolve(WORKING_DIR, 'public'));
  } else {
    ensureDirSync(resolve(WORKING_DIR, 'public/packages/main'));

    copyFileSync(
      resolve(WORKING_DIR, 'src/test.html'),
      resolve(WORKING_DIR, 'public/test.html')
    );

    copyFileSync(
      resolve(WORKING_DIR, 'packages/main/index.js'),
      resolve(WORKING_DIR, 'public/packages/main/index.js')
    );
  }

  loadPackages(resolve(WORKING_DIR, 'packages'))
    .then((bookmarklets) => buildHtml(bookmarklets))
    .then(() => console.log('Done!'))
    .catch(exit);
} catch (error) {
  exit(error);
}
