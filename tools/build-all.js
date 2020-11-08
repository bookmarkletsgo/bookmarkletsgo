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
  copySync,
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

function printInfo(bookmarklets) {
  console.log(''.padEnd(50, '='));
  let total = 0;
  bookmarklets.forEach((bookmarklet) => {
    console.log(
      `${bookmarklet._id.padEnd(40, ' ')} | ${
        bookmarklet.bookmarkletSrc.length
      }`
    );
    total += bookmarklet.bookmarkletSrc.length;
  });
  console.log(`${'Total'.padEnd(40, ' ')} | ${total}`);
  console.log(''.padEnd(50, '='));
}

function saveGeneratedPackages(bookmarklets, destPath) {
  bookmarklets.forEach((bookmarklet) => {
    ensureDirSync(resolve(destPath, bookmarklet._id));
    writeFile(
      resolve(destPath, bookmarklet._id + '/index.js'),
      bookmarklet.generatedSrc
    );
  });
}

function buildHtml(bookmarklets) {
  const list = bookmarklets
    .sort((a, b) => {
      // if (a._id === 'main') {
      //   return -1;
      // }
      //
      // if (b._id === 'main') {
      //   return 1;
      // }
      //
      // if (a._id === 'main-live') {
      //   return -1;
      // }
      //
      // if (b._id === 'main-live') {
      //   return 1;
      // }

      if (a._id.startsWith('main') && !b._id.startsWith('main')) {
        return -1;
      }
      if (b._id.startsWith('main') && !a._id.startsWith('main')) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    })
    .map(
      (bookmarklet) =>
        `<li><a id="bookmarkletsgo_${bookmarklet._id}" href="${
          bookmarklet.bookmarkletSrc
        }" data-href="${bookmarklet.bookmarkletSrc}">${
          bookmarklet.title || bookmarklet.name
        }</a> (<a class="btn_copy" href="#">Copy</a>)</li>`
    );

  return Promise.all([
    readFile(htmlTemplteFilepath, 'utf-8'),
    // readFile(jsFilepath, 'utf-8')
    buildBookmarklet(jsFilepath, {
      urlencode: false,
      minify: true
    }).then((bookmarklet) =>
      bookmarklet.bookmarkletSrc.replace(/^javascript:/, '')
    )
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
              buildBookmarklet(resolve(subDirpath, 'index.js')),
              buildBookmarklet(resolve(subDirpath, 'index.js'), {
                urlencode: false,
                minify: true
              })
            ]).then(([content, bookmarklet, bookmarklet2]) => ({
              ...content,
              ...bookmarklet,
              ...{
                generatedSrc: bookmarklet2.bookmarkletSrc.replace(
                  /^javascript:/,
                  ''
                )
              },
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
    copyFileSync(
      resolve(WORKING_DIR, 'src/test.html'),
      resolve(WORKING_DIR, 'public/test.html')
    );
  }

  copySync(
    resolve(WORKING_DIR, 'lib/polyfill'),
    resolve(WORKING_DIR, 'public/lib/polyfill')
  );

  loadPackages(resolve(WORKING_DIR, 'packages'))
    .then((bookmarklets) => {
      printInfo(bookmarklets);
      saveGeneratedPackages(
        bookmarklets,
        resolve(WORKING_DIR, 'public/packages/')
      );
      buildHtml(bookmarklets);
    })
    .then(() => console.log('Done!'))
    .catch(exit);
} catch (error) {
  exit(error);
}
