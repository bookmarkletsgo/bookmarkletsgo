import * as window from 'window';
import * as document from 'document';
import { addEventListener } from '../lib/common';
import copy from '../lib/copy-common';

// const specialCharactersPattern = new RegExp(
//   ["'", '"', '<', '>', '#', '@', ' ', '\\&', '\\?'].join('|'),
//   'g'
// );
// const urlencode = (code) =>
//   code.replace(specialCharactersPattern, encodeURIComponent);
const setTitleAndUrl = (item) => {
  history.pushState(null, '', '#' + item.href);
  // history.pushState(null, '', '#' + urlencode(item.href));
  // eslint-disable-next-line no-import-assign
  document.title = item.text || 'BookmarkletsGo';
};

document.querySelectorAll('a').forEach((item) => {
  if (item.classList.contains('btn_copy')) {
    addEventListener(item, 'click', (event) => {
      const bookmarklet = event.target.parentNode.firstChild;
      copy(bookmarklet.href);

      event.preventDefault();
      return false;
    });
  } else {
    addEventListener(item, 'click', (event) => {
      // setting title and url after copy-title-url bookmarklets have executed
      setTimeout(() => setTitleAndUrl(event.target), 100);

      const script = decodeURIComponent(event.target.href.slice(11));
      // console.log(script);
      if (window.top !== window) {
        if (
          script.indexOf('void') === 0 ||
          script.indexOf("'use strict';void") === 0 ||
          script.indexOf('(function') === 0
        ) {
          window.top.postMessage(script, '*');
        }

        event.preventDefault();
      }

      return false;
    });

    // initialize title and URL
    if (item.id === 'bookmarkletsgo_main') {
      setTitleAndUrl(item);
    }
  }
});
