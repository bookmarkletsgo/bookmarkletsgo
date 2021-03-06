'use strict';
import * as window from 'window';
import * as p from '../../lib/polyfill/exports';
p.apply(window, [p.String.startsWith, p.Element.remove, p.ObjectAssign]);
import * as document from 'document';
import * as setTimeout from 'setTimeout';
import { addEventListener, hasClass, dummyParam } from '../../lib/common';
import { postMessage, addMessageHandler } from '../../lib/message';
import { createElement } from '../../lib/create-element';
import { querySelector } from '../../lib/query-selector';
import { setAttribute } from '../../lib/set-attribute';
import { append } from '../../lib/element-append';
import executeScript from '../../lib/execute-script';
import iframeSetHtml from '../../lib/iframe-set-html';
import iframeOnload from '../../lib/iframe-onload';
import {
  initialized,
  removeEventListener,
  style
} from '../../lib/property-names';
import {
  APP_NAME,
  APP_SELECTOR,
  APP_GLOBAL_NAME,
  APP_URL,
  COMMAND_RUN_PREFIX
} from '../../lib/constants';
import copy from '../../lib/copy-common';
const globalVal = window[APP_GLOBAL_NAME] || {};
window[APP_GLOBAL_NAME] = globalVal;

const toggleView = () => {
  const container = querySelector(APP_SELECTOR);
  if (container) {
    const style = querySelector(APP_SELECTOR).style;
    style.display = style.display === 'block' ? 'none' : 'block';
  } else {
    globalVal[initialized] = false;
  }
};

// post message of information of host to bookmarklet runner
const postContextMessage = (target) => {
  if (target) {
    postMessage(target, {
      type: 'context',
      content: {
        location: {
          hash: location.hash,
          host: location.host,
          hostname: location.hostname,
          href: location.href,
          origin: location.origin,
          pathname: location.pathname,
          port: location.port,
          protocal: location.protocal,
          search: location.search
        },
        document: {
          title: document.title,
          documentElement: {
            innerHTML: document.documentElement.innerHTML
          }
        }
      }
    });
  }
};

if (globalVal[initialized] && globalVal[removeEventListener]) {
  toggleView();
} else {
  if (querySelector(APP_SELECTOR)) {
    querySelector(APP_SELECTOR).remove();
  }

  if (globalVal[removeEventListener]) {
    globalVal[removeEventListener]();
    globalVal[removeEventListener] = null;
  }

  const iframeUrl = APP_URL + dummyParam();
  let iframeLoaded = false;
  let openedWindow = null;

  globalVal[removeEventListener] = addMessageHandler(window, (message, evt) => {
    if (message.type === 'iframe_content') {
      const iframe = querySelector(APP_SELECTOR + ' > iframe');
      if (!iframe) return;
      iframeSetHtml(iframe, message.content);
      (function () {
        const window = iframe.contentWindow;
        let document = null;
        try {
          document = iframe.contentDocument;
        } catch (_) {
          try {
            document = window.document;
          } catch (_) {}
        }

        if (!window || !document) {
          return;
        }

        function isCSP() {
          try {
            window.eval('1+1');
            return false;
          } catch (_) {
            return true;
          }
        }

        if (isCSP()) {
          addEventListener(
            document,
            'click',
            (event) => {
              event.preventDefault();
              const target = event.target;
              if (hasClass(target, 'btn_copy')) {
                const bookmarklet = target.parentNode.firstChild;
                copy(bookmarklet.href);
              } else {
                const url = target.href;
                // eslint-disable-next-line no-script-url
                if (url && url.startsWith('javascript:')) {
                  const win = window.open(
                    APP_URL + COMMAND_RUN_PREFIX + target.id.slice(15),
                    APP_NAME + '_run'
                  );
                  // post a message immediately if the window have been opened
                  postContextMessage(win);
                }
              }
            },
            true
          );
        }
      })();

      if (openedWindow) {
        openedWindow.close();
      }

      onInitialize();
    } else if (message.type === 'script') {
      // To use alert and prompt function on Chrome, it should add some delay when execute the script.
      executeScript(message.content, (error) => {
        if (error) {
          alert(
            "Do not support this site due to Content Security Policy.\nDrag and drop bookmarklets to the 'Bookmarks Bar' of your browser."
          );
        }
      });
      // } else if (message.type === 'message') {
    } else if (message.content === 'iframe_loaded') {
      iframeLoaded = true;
      onInitialize();
    } else if (message.content === 'opened_window_loaded') {
      postContextMessage(evt.source);
    }
  });

  const ifrm = createElement('iframe');
  const loadAboutBlank = () => {
    console.info('load about:blank');
    window.name = 'parent';
    setAttribute(ifrm, 'src', 'about:blank');
    setTimeout(() => {
      if (!globalVal[initialized]) {
        setMessage(
          'Please allow "Open Pop-up Windows" on this site and try again.'
        );
      }
    }, 2000);
    openedWindow = window.open(iframeUrl, APP_NAME);
    window.focus();
  };

  iframeOnload(ifrm, () => {
    // Check 'iframeLoaded' after 50ms, because of Safari and IE recieves postMessage from iframe after iframe onload
    setTimeout(() => {
      console.info('recieved message from iframe: ' + iframeLoaded);
      if (!iframeLoaded) {
        iframeLoaded = true;
        loadAboutBlank();
      }
    }, 50);
  });

  console.info('start load iframe');
  setAttribute(ifrm, 'src', iframeUrl);

  setAttribute(
    ifrm,
    style,
    'width:100%;height:100%;border:0;margin:0;padding:0'
  );
  const div = createElement('div');
  div.id = APP_NAME;
  setAttribute(
    div,
    style,
    'width:300px;height:300px;position:fixed;top:10px;right:10px;z-index:2147483656;background-color:#f2f2f2;opacity:85%;display:block'
  );
  const closeBtn = createElement('div');
  setAttribute(closeBtn, style, 'position:fixed;top:20px;right:40px;');
  closeBtn.innerHTML = '<a href="#" style="text-decoration:none">Done</a>';
  const messagePanel = createElement('div');
  setAttribute(messagePanel, style, 'position:absolute;top:20px;left:20px;');
  messagePanel.innerHTML = '<h3>Loading...</h3>';
  append(div, ifrm);
  append(div, closeBtn);
  append(div, messagePanel);
  addEventListener(closeBtn.firstChild, 'click', function (event) {
    event.preventDefault();
    if (globalVal[initialized]) {
      toggleView();
    } else {
      div.remove();
    }
  });

  append(document.body, div);

  const setMessage = (message) => {
    messagePanel.innerHTML = `<h3>${message}</h3>`;
  };

  const onInitialize = () => {
    globalVal[initialized] = true;
    messagePanel.style.display = 'none';
  };
}
