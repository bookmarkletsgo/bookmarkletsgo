'use strict';
import * as window from 'window';
import * as document from 'document';
import { createElement, addEventListener, hasClass } from '../../lib/common';
import { serverOrigin as iframeOrigin } from '../../lib/config';
import executeScript from '../../lib/execute-script';
import iframeSetHtml from '../../lib/iframe-set-html';
import iframeOnload from '../../lib/iframe-onload';
import { origin } from '../../lib/property-names';
import copy from '../../lib/copy-common';
const querySelector = (selector) =>
  document.querySelector(selector) || createElement('a');
// always return false
// eslint-disable-next-line no-return-assign
const toggleView = (show) =>
  !(querySelector('#bookmarkletsgo').style.display = show ? 'block' : 'none');

if (window.__BOOKMARKLETSGO_INITED) {
  toggleView(true);
} else {
  const iframeUrl = iframeOrigin + '/bookmarklets.html';
  let iframeLoaded = false;
  let openedWindow = null;

  // Message handler
  addEventListener(window, 'message', (event) => {
    console.log(event);
    console.log({
      type: event.data.type,
      content: event.data.content,
      origin: event.origin
    });
    const message = event.data;
    if (
      (event[origin] === iframeOrigin || event[origin] === location[origin]) &&
      typeof message === 'object' &&
      message.from === 'bookmarkletsgo'
    ) {
      if (message.type === 'iframe_content') {
        const iframe = document.querySelector('#bookmarkletsgo > iframe');
        iframeSetHtml(iframe, message.content);
        (function () {
          const window = iframe.contentWindow;
          const document = iframe.contentDocument;
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
      }
    }
  });

  try {
    const ifrm = createElement('iframe');
    const loadAboutBlank = () => {
      console.info('load about:blank');
      window.name = 'parent';
      ifrm.setAttribute('src', 'about:blank');
      openedWindow = window.open(iframeUrl, 'bookmarkletsgo');
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
    div.id = 'bookmarkletsgo';
    div.style =
      'width:300px;height:300px;position:fixed;top:10px;right:10px;z-index:2147483656;background-color:#f2f2f2;opacity:85%;display:block';
    const closeBtn = createElement('div');
    closeBtn.style = 'position:fixed;top:20px;right:40px;';
    closeBtn.innerHTML = '<a href="#" style="text-decoration:none">Done</a>';
    div.append(ifrm);
    div.append(closeBtn);
    addEventListener(closeBtn.firstChild, 'click', function (event) {
      event.preventDefault();
      return toggleView(false);
    });

    document.body.append(div);
  } catch (error) {
    console.error('Error on initialize iframe');
    console.error(error);
  }

  // eslint-disable-next-line no-import-assign
  window.__BOOKMARKLETSGO_INITED = true;
}
