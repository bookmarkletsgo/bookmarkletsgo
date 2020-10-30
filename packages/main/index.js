'use strict';
import * as window from 'window';
import * as document from 'document';
import * as setTimeout from 'setTimeout';
import {
  createElement,
  querySelector,
  addEventListener,
  hasClass
} from '../../lib/common';
import { serverOrigin as iframeOrigin } from '../../lib/config';
import executeScript from '../../lib/execute-script';
import iframeSetHtml from '../../lib/iframe-set-html';
import iframeOnload from '../../lib/iframe-onload';
import {
  origin,
  initialized,
  messageEventListener
} from '../../lib/property-names';
import { APP_NAME, APP_SELECTOR, APP_GLOBAL_NAME } from '../../lib/constants';
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

if (globalVal[initialized]) {
  toggleView();
} else {
  if (querySelector(APP_SELECTOR)) {
    querySelector(APP_SELECTOR).remove();
  }

  const iframeUrl = iframeOrigin + '/bookmarklets.html';
  let iframeLoaded = false;
  let openedWindow = null;

  if (globalVal[messageEventListener]) {
    window.removeEventListener('message', globalVal[messageEventListener]);
    globalVal[messageEventListener] = null;
  }

  globalVal[messageEventListener] = (event) => {
    console.log(event);
    console.log({
      type: event.data.type,
      content: event.data.content,
      origin: event.origin
    });
    const message = event.data;
    const messageOrigin = event[origin];
    // compare with window.origin for cloned page(about:blank).
    if (
      (messageOrigin === iframeOrigin ||
        messageOrigin === location[origin] ||
        messageOrigin === window[origin]) &&
      typeof message === 'object' &&
      message.from === APP_NAME
    ) {
      if (message.type === 'iframe_content') {
        const iframe = querySelector(APP_SELECTOR + ' > iframe');
        if (!iframe) return;
        iframeSetHtml(iframe, message.content);
        (function () {
          const window = iframe.contentWindow;
          const document = iframe.contentDocument;
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
            document.addEventListener(
              'click',
              (event) => {
                event.preventDefault();
                const target = event.target;
                if (hasClass(target, 'btn_copy')) {
                  const bookmarklet = target.parentNode.firstChild;
                  copy(bookmarklet.href);
                } else {
                  let url = target.href;
                  // eslint-disable-next-line no-script-url
                  if (url && url.indexOf('javascript:') === 0) {
                    url = iframeOrigin + '/bookmarklets.html#run:' + url;
                    url = window.open(url, '_blank');
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
      }
    }
  };

  // Message handler
  addEventListener(window, 'message', globalVal[messageEventListener]);

  const ifrm = createElement('iframe');
  const loadAboutBlank = () => {
    console.info('load about:blank');
    window.name = 'parent';
    ifrm.setAttribute('src', 'about:blank');
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
    // Check 'iframeLoaded' after 10ms, because of Safari recieves postMessage from iframe after iframe onload
    setTimeout(() => {
      console.info('recieved message from iframe: ' + iframeLoaded);
      if (!iframeLoaded) {
        iframeLoaded = true;
        loadAboutBlank();
      }
    }, 10);
  });

  ifrm.setAttribute('src', iframeUrl);

  ifrm.style = 'width:100%;height:100%;border:0;margin:0;padding:0';
  const div = createElement('div');
  div.id = APP_NAME;
  div.style =
    'width:300px;height:300px;position:fixed;top:10px;right:10px;z-index:2147483656;background-color:#f2f2f2;opacity:85%;display:block';
  const closeBtn = createElement('div');
  closeBtn.style = 'position:fixed;top:20px;right:40px;';
  closeBtn.innerHTML = '<a href="#" style="text-decoration:none">Done</a>';
  const messagePanel = createElement('div');
  messagePanel.style = 'position:absolute;top:20px;left:20px;';
  messagePanel.innerHTML = '<h3>Loading...</h3>';
  div.append(ifrm);
  div.append(closeBtn);
  div.append(messagePanel);
  addEventListener(closeBtn.firstChild, 'click', function (event) {
    event.preventDefault();
    if (globalVal[initialized]) {
      toggleView();
    } else {
      div.remove();
    }
  });

  document.body.append(div);

  const setMessage = (message) => {
    messagePanel.innerHTML = `<h3>${message}</h3>`;
  };

  const onInitialize = () => {
    globalVal[initialized] = true;
    messagePanel.style.display = 'none';
  };
}
