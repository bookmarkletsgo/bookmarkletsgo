import * as window from 'window';
import * as p from '../lib/polyfill/exports';
p.apply(window, [p.String.startsWith]);
import * as document from 'document';
import * as location from 'location';
import {
  addEventListenerX,
  isIE,
  hasClass,
  addClass,
  removeClass
} from '../lib/common';
import { forEach } from '../lib/array-foreach';
import { includes } from '../lib/array-includes';
import copy from '../lib/copy-common';
import executeScript from '../lib/execute-script';
import { postMessage, addMessageHandler } from '../lib/message';
import { getIds, add, remove } from '../lib/favorites';
import { querySelector } from '../lib/query-selector';
import { getAttribute } from '../lib/get-attribute';
import {
  BOOKMARKLETS_SELECTOR_PREFIX,
  COMMAND_RUN_PREFIX
} from '../lib/constants';

const top = window.top;
const isIframe = window.top !== window;
const opener = window.opener;

const decode = decodeURIComponent;
// eslint-disable-next-line no-script-url
const getScript = (s) => decode(s.slice(s.indexOf('javascript:') + 11));

// data-href for IE
const getHref = (e) =>
  e ? getAttribute(e, 'data-href') || getAttribute(e, 'href') : '';

const postBookmarketMessage = (target, element) => {
  const href = getHref(element);
  const script = getScript(href);
  // console.log(script);
  if (
    script.indexOf('void') === 0 ||
    script.indexOf("'use strict';void") === 0 ||
    script.indexOf("'use strict';var _typeof") === 0 ||
    script.indexOf('(function') === 0
  ) {
    postMessage(target, { type: 'script', content: script });
  }
};

// const specialCharactersPattern = new RegExp(
//   ["'", '"', '<', '>', '#', '@', ' ', '\\&', '\\?'].join('|'),
//   'g'
// );
// const urlencode = (code) =>
//   code.replace(specialCharactersPattern, encodeURIComponent);

const setTitleAndUrl = (item) => {
  if (isIframe) return;
  try {
    // https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
    if (!isIE() || item.href.length < 2000) {
      location.hash = '#' + item.href;
    } else {
      location.hash = '#none';
    }
  } catch (_) {}

  // eslint-disable-next-line no-import-assign
  document.title = item.text || 'BookmarkletsGo';
};

const favoritesIds = getIds();
forEach(document.querySelectorAll('a'), (item) => {
  if (hasClass(item, 'btn_copy')) {
    addEventListenerX(item, 'click', (event) => {
      const bookmarklet = event.target.parentNode.firstChild;
      copy(getHref(bookmarklet));

      event.preventDefault();
    });
  } else if (hasClass(item, 'btn_add_fav')) {
    if (includes(favoritesIds, item.parentNode.firstChild.id.slice(15))) {
      addClass(item, 'on');
      item.textContent = 'Remove from Favorites';
    }

    addEventListenerX(item, 'click', (event) => {
      const target = event.target;
      const bookmarklet = target.parentNode.firstChild;
      const item = {
        _id: bookmarklet.id.slice(15),
        name: bookmarklet.name,
        code: getHref(bookmarklet)
      };
      remove(item);
      if (hasClass(target, 'on')) {
        removeClass(target, 'on');
        target.textContent = 'Add to Favorites';
      } else {
        add(item);
        addClass(target, 'on');
        target.textContent = 'Remove from Favorites';
      }

      event.preventDefault();
    });
  } else {
    addEventListenerX(item, 'click', (event) => {
      // setting title and url after copy-title-url bookmarklets have executed
      setTimeout(() => setTitleAndUrl(event.target), 100);

      if (isIframe) {
        postBookmarketMessage(top, event.target);
        event.preventDefault();
      } else if (opener) {
        if (
          opener.top !== opener ||
          opener === window ||
          window.name === 'parent'
        ) {
          // Open from the iframe in CSP enabled site
          // or opener is current page
          return false;
        }

        postBookmarketMessage(opener, event.target);
        event.preventDefault();
      } else if (isIE()) {
        const href = getHref(event.target);
        // https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
        if (href.length >= 5200) {
          const script = getScript(href);
          executeScript(script, (error) => {
            if (error) {
              console.log(error);
              alert('This site does not support the selected bookmarklet.');
            }
          });
          event.preventDefault();
        }
      }
    });
  }
});

addMessageHandler(window, (message) => {
  if (message.type === 'get_script') {
    const id = message.content;
    console.info('get: ' + id);
    const item = querySelector(BOOKMARKLETS_SELECTOR_PREFIX + id);
    if (item) {
      postBookmarketMessage(opener, item);
    }
  }
});

if (location.hash.startsWith(COMMAND_RUN_PREFIX)) {
  const id = location.hash.slice(19);
  console.info('run: ' + id);
  const item = querySelector(BOOKMARKLETS_SELECTOR_PREFIX + id);
  if (item) {
    const script = getScript(getHref(item));
    executeScript(script, (error) => {
      if (error) {
        console.log(error);
        alert('This site does not support the selected bookmarklet.');
      }
    });
  }
} else {
  if (opener) {
    postMessage(opener, { type: 'message', content: 'opened_window_loaded' });
    let html = document.documentElement.innerHTML;
    html = html.replace('.csp_on {display: none}', '.csp_off {display: none}');
    postMessage(opener, { type: 'iframe_content', content: html });
  }

  // initialize title and URL
  setTitleAndUrl(querySelector(BOOKMARKLETS_SELECTOR_PREFIX + 'main'));
}

if (isIframe) {
  postMessage(top, { type: 'message', content: 'iframe_loaded' });
} else {
  querySelector('#tip_bookmark').style.display = '';
}

const cspStyle = querySelector('style');
cspStyle.innerHTML = cspStyle.innerHTML.replace('.csp_off', '.csp_on');

console.log('==============');
// eslint-disable-next-line no-eval
window.eval('console.log("use eval()");');
// eslint-disable-next-line no-new-func
new Function('console.log("use new Function()")')();
console.log('top === window', top === window);
// eslint-disable-next-line no-eq-null,eqeqeq
console.log('opener == null', opener == null);
console.log('window.name', window.name);
