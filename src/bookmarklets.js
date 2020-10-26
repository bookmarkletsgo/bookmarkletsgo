import * as window from 'window';
import * as document from 'document';
import { addEventListener } from '../lib/common';
import copy from '../lib/copy-common';
import executeScript from '../lib/execute-script';
const top = window.top;
const opener = window.opener;

const decode = decodeURIComponent;
// eslint-disable-next-line no-script-url
const getScript = (s) => decode(s.slice(s.indexOf('javascript:') + 11));
const postMessage = (target, message) => {
  target.postMessage(Object.assign({ from: 'bookmarkletsgo' }, message), '*');
};

import { querySelector } from '../lib/property-names';

// const specialCharactersPattern = new RegExp(
//   ["'", '"', '<', '>', '#', '@', ' ', '\\&', '\\?'].join('|'),
//   'g'
// );
// const urlencode = (code) =>
//   code.replace(specialCharactersPattern, encodeURIComponent);
const setTitleAndUrl = (item) => {
  // if (top === window) {
  //   history.pushState(null, '', '#' + item.href);
  // } else {
  //   location.hash = '#' + item.href;
  // }
  // history.pushState(null, '', '#' + urlencode(item.href));
  location.hash = '#' + item.href;
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

      const postBookmarketMessage = (target, href) => {
        const script = getScript(href);
        // console.log(script);
        if (
          script.indexOf('void') === 0 ||
          script.indexOf("'use strict';void") === 0 ||
          script.indexOf('(function') === 0
        ) {
          postMessage(target, { type: 'script', content: script });
        }
      };

      if (top !== window) {
        postBookmarketMessage(top, event.target.href);
        event.preventDefault();
      } else if (opener) {
        if (
          opener.top !== opener ||
          opener === window ||
          window.name === 'parent'
        ) {
          // Open from the iframe in CSP enabled site
          // or opener is this page
          return false;
        }

        postBookmarketMessage(opener, event.target.href);
        event.preventDefault();
      }
    });
  }
});

if (location.hash.includes('run:javascript:')) {
  const script = getScript(location.hash);
  executeScript(script, (error) => {
    if (error) {
      console.log(error);
      alert('This site does not support the selected bookmarklet.');
    }
  });
} else {
  if (opener) {
    let html = document.documentElement.innerHTML;
    html = html.replace('.csp_on {display: none}', '.csp_off {display: none}');
    postMessage(opener, { type: 'iframe_content', content: html });
  }

  // initialize title and URL
  setTitleAndUrl(document[querySelector]('#bookmarkletsgo_main'));
}

if (top === window) {
  document[querySelector]('#tip_bookmark').style.display = '';
} else {
  postMessage(top, { type: 'message', content: 'iframe_loaded' });
}

const cspStyle = document[querySelector]('style');
cspStyle.innerHTML = cspStyle.innerHTML.replace('.csp_off', '.csp_on');

console.log('==============');
// eslint-disable-next-line no-eval
eval('console.log("use eval()");');
// eslint-disable-next-line no-new-func
new Function('console.log("use new Function()")')();
console.log('top === window', top === window);
console.log('opener === null', opener === null);
console.log('window.name', window.name);
