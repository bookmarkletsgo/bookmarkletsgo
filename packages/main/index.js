'use strict';
import * as window from 'window';
import * as document from 'document';
import { createElement, addEventListener } from '../../lib/common';
import { serverOrigin as iframeOrigin } from '../../lib/config';

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

  addEventListener(window, 'message', (event) => {
    if (event.origin !== iframeOrigin) return;
    const bookmarklet = event.data;
    // To use alert and prompt function on Chrome, it should add some delay when execute the script.
    setTimeout(() => {
      const script = createElement('script');
      script.text = bookmarklet;
      document.body.append(script);
      script.remove();
    }, 200);
  });

  const ifrm = createElement('iframe');
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
  // eslint-disable-next-line no-import-assign
  window.__BOOKMARKLETSGO_INITED = true;
}
