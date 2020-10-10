import * as window from 'window';
import * as document from 'document';

// const specialCharactersPattern = new RegExp(
//   ["'", '"', '<', '>', '#', '@', ' ', '\\&', '\\?'].join('|'),
//   'g'
// );
// const urlencode = (code) =>
//   code.replace(specialCharactersPattern, encodeURIComponent);
const setTitleAndUrl = (item) => {
  history.pushState(null, '', '#' + item.href);
  // history.pushState(null, '', '#' + urlencode(item.href));
  document.title = item.text || 'BookmarkletsGo';
};

document.querySelectorAll('a').forEach((item) => {
  item.addEventListener(
    'click',
    (event) => {
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
    },
    false
  );

  // initialize title and URL
  if (item.id === 'bookmarkletsgo_main') {
    setTitleAndUrl(item);
  }
});
