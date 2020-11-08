import * as setTimeout from 'setTimeout';
import { addEventListener } from './common';

function iframeOnload_(iframe, onloadHandler, timeout) {
  let iframeLoaded = false;
  timeout = timeout || 3000;

  const iframeDidLoad = (event) => {
    // console.log(event);
    if (!iframeLoaded) {
      console.info('iframe have loaded.');
      iframeLoaded = true;
      if (typeof onloadHandler === 'function') {
        onloadHandler(event);
      }
    }
  };

  // execute when load success or meet Content Security Policy issues (set frame-src or upgrade-insecure-requests), or set X-Frame-Options
  addEventListener(iframe, 'load', iframeDidLoad);

  // When meet Mixed Content error, iframe will not triger load event.
  // it will load 'about:blank' then end.
  function checkIframeLoaded() {
    // console.log('checkIframeLoaded');
    if (iframeLoaded) return;
    const iframeDoc = iframe.contentDocument;
    // iframeDoc && console.log(iframeDoc.readyState);
    // iframeDoc && console.log(iframeDoc.location);
    // Check if loading is complete
    if (iframeDoc && iframeDoc.readyState === 'complete') {
      // The loading is complete, call the function we want executed once the iframe is loaded
      // if (!iframe.contentWindow.location.href.includes(iframe.src)) {
      // handler Mixed Content error
      // }
      iframeDidLoad({ type: 'readyState:' + iframeDoc.readyState });
      return;
    }

    // firefox
    if (iframeDoc && iframeDoc.readyState === 'uninitialized') {
      iframeDidLoad({ type: 'readyState:uninitialized' });
      return;
    }

    // If we are here, it is not loaded. Set things up so we check the status again in 100 milliseconds
    setTimeout(checkIframeLoaded, 100);
  }

  // start check after connect to server, default timeout is 1s.
  setTimeout(checkIframeLoaded, timeout);
  // firefox: CSP(upgrade-insecure-requests). e.g. https://stackoverflow.com/
  setTimeout(() => {
    iframeDidLoad({ type: 'timeout' });
  }, 10000);
}

export default function iframeOnload(iframe, onloadHandler, timeout) {
  iframeOnload_(iframe, onloadHandler, timeout);
}
