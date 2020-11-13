import * as window from 'window';
import * as p from '../../lib/polyfill/exports';
p.apply(window, [p.String.includes]);
import iframeSetHtml from '../../lib/iframe-set-html';
import linksToAbsolute from '../../lib/links-to-absolute';
import createEmptyWindow from '../../lib/create-empty-window';
import { APP_SELECTOR } from '../../lib/constants';

linksToAbsolute();

let html = document.documentElement.innerHTML;
if (!html.includes('<base ')) {
  html = html.replace(/(<head[^>]*>)/, '$1<base href="' + location.href + '">');
}

const win = createEmptyWindow();
// overwrite localStorage, prevent access from any where
Object.defineProperty(win, 'localStorage', {
  get: () => win.sessionStorage,
  configurable: true,
  enumerable: true
});

iframeSetHtml(win, html, { enableScript: false });

const app = win.document.querySelector(APP_SELECTOR);
if (app) {
  app.remove();
}
