import * as window from 'window';
import { isIE, getIEVersion, dummyParam } from '../../lib/common';
import { APP_NAME, APP_GLOBAL_NAME } from '../../lib/constants';
import { serverOrigin as iframeOrigin } from '../../lib/config';
import executeScript from '../../lib/execute-script';
import { postMessage, addMessageHandler } from '../../lib/message';

if (isIE() && getIEVersion() < 10) {
  alert('Do not support this browser, please update your browser.');
} else {
  const globalVal = window[APP_GLOBAL_NAME] || {};
  const initialized = 'initialized';
  window[APP_GLOBAL_NAME] = globalVal;

  const removeEventListener = addMessageHandler(window, (message) => {
    if (message.type === 'script') {
      if (!globalVal[initialized]) {
        executeScript(message.content, (error) => {
          if (error) {
            alert(
              "Do not support this site due to Content Security Policy.\nDrag and drop bookmarklets to the 'Bookmarks Bar' of your browser."
            );
          }
        });
      }

      removeEventListener();
      if (openedWindow) {
        openedWindow.close();
      }
      // } else if (message.type === 'message') {
    } else if (message.content === 'opened_window_loaded') {
      if (openedWindow) {
        postMessage(openedWindow, { type: 'get_script', content: 'main' });
      }
    }
  });

  const iframeUrl = iframeOrigin + '/bookmarklets.html' + dummyParam();
  if (window.name === APP_NAME) window.name = null;
  const openedWindow = window.open(iframeUrl, APP_NAME);
  if (!openedWindow) {
    alert('Please allow "Open Pop-up Windows" on this site and try again.');
  }
}
