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
import { getById, addAll } from '../lib/bookmarklets';
import { querySelector } from '../lib/query-selector';
import { APP_GLOBAL_NAME, COMMAND_RUN_PREFIX } from '../lib/constants';

const globalVal = window[APP_GLOBAL_NAME] || {};
window[APP_GLOBAL_NAME] = globalVal;
globalVal.callback = (data) => {
  addAll(data);
};

const top = window.top;
const isIframe = window.top !== window;
const opener = window.opener;

const decode = decodeURIComponent;
// eslint-disable-next-line no-script-url
const getScript = (s) => decode(s.slice(s.indexOf('javascript:') + 11));

const getIdFromElement = (element) => element.id.slice(15);

const runBookmarkletById = (id) => {
  const item = getById(id);
  if (item) {
    const script = getScript(item.bookmarkletSrc);
    executeScript(script, (error) => {
      if (error) {
        console.log(error);
        alert('This site does not support the selected bookmarklet.');
      }
    });
    return true;
  }

  alert('Can not find this bookmarklet.');
  return false;
};

const postBookmarketMessageById = (target, id) => {
  const item = getById(id);
  if (item) {
    const script = getScript(item.bookmarkletSrc);
    postMessage(target, { type: 'script', content: script });
    return true;
  }

  alert('Can not find this bookmarklet.');
  return false;
};

// const specialCharactersPattern = new RegExp(
//   ["'", '"', '<', '>', '#', '@', ' ', '\\&', '\\?'].join('|'),
//   'g'
// );
// const urlencode = (code) =>
//   code.replace(specialCharactersPattern, encodeURIComponent);

const setTitleAndUrlById = (id) => {
  if (isIframe) return;
  const item = getById(id);
  if (item) {
    try {
      // https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
      if (!isIE() || item.bookmarkletSrc.length < 2000) {
        location.hash = '#' + item.bookmarkletSrc;
      } else {
        location.hash = '#none';
      }
    } catch (_) {}

    // eslint-disable-next-line no-import-assign
    document.title = item.title;
  }
};

const favoritesIds = getIds();

forEach(document.querySelectorAll('a'), (item) => {
  if (hasClass(item, 'btn_copy')) {
    addEventListenerX(item, 'click', (event) => {
      event.preventDefault();
      const bookmarklet = event.target.parentNode.firstChild;
      const item = getById(getIdFromElement(bookmarklet));
      if (item) {
        copy(item.bookmarkletSrc);
      } else {
        alert('Can not find this bookmarklet.');
      }
    });
  } else if (hasClass(item, 'btn_add_fav')) {
    if (includes(favoritesIds, getIdFromElement(item.parentNode.firstChild))) {
      addClass(item, 'on');
      item.textContent = 'Remove from Favorites';
    }

    addEventListenerX(item, 'click', (event) => {
      event.preventDefault();
      const target = event.target;
      const bookmarklet = target.parentNode.firstChild;
      const item = getById(getIdFromElement(bookmarklet));
      if (!item) {
        return alert('Can not find this bookmarklet.');
      }

      remove(item);
      if (hasClass(target, 'on')) {
        removeClass(target, 'on');
        target.textContent = 'Add to Favorites';
      } else {
        add(item);
        addClass(target, 'on');
        target.textContent = 'Remove from Favorites';
      }
    });
  } else {
    addEventListenerX(item, 'click', (event) => {
      const id = getIdFromElement(event.target);
      // setting title and url after copy-title-url bookmarklets have executed
      setTimeout(() => setTitleAndUrlById(id), 100);

      if (isIframe) {
        postBookmarketMessageById(top, id);
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

        postBookmarketMessageById(opener, id);
        event.preventDefault();
      } else if (runBookmarkletById(id)) {
        event.preventDefault();
      }
    });
  }
});

addMessageHandler(window, (message, event) => {
  if (message.type === 'get_script') {
    const id = message.content;
    console.info('get: ' + id);
    postBookmarketMessageById(event.source, id);
  }
});

if (location.hash.startsWith(COMMAND_RUN_PREFIX)) {
  const id = location.hash.slice(19);
  console.info('run: ' + id);
  runBookmarkletById(id);
} else {
  if (opener) {
    postMessage(opener, { type: 'message', content: 'opened_window_loaded' });
    let html = document.documentElement.innerHTML;
    html = html.replace('.csp_on {display: none}', '.csp_off {display: none}');
    postMessage(opener, { type: 'iframe_content', content: html });
  }

  // initialize title and URL
  setTitleAndUrlById('main');
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

// rewrite localStorage, prevent access from any where
Object.defineProperty(window, 'localStorage', {
  get: () => window.sessionStorage,
  configurable: false,
  enumerable: true
});
