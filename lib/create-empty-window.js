import * as window from 'window';
import * as document from 'document';
import * as location from 'location';

export default function createEmptyWindow(options) {
  options = Object.assign({}, options);
  let newWin;
  try {
    // options.url should starts with ? or #
    const url = options.url
      ? 'about:blank' + options.url
      : location.pathname.endsWith('/')
      ? 'about:blank/' // Do not work on firefox and safari
      : '';
    newWin = window.open(url, '_blank');
    // Access document for check SecurityError(cross-origin frame).
    // eslint-disable-next-line no-unused-expressions
    'document' in newWin;
  } catch (_) {
    if (newWin) {
      newWin.close();
    }

    newWin = window.open('', '_blank');
  }

  try {
    const context = window.context || { window, location, document };
    (function (window) {
      window.context = context;

      window.opener = null;

      // override URL
      const OrgURL = window.URL;
      // eslint-disable-next-line func-names
      window.URL = function URL(url, base) {
        if (!base || base === 'null') {
          base = context.location.origin;
        }

        if (base.startsWith('about')) {
          base = context.location.href;
        }

        return new OrgURL(url, base);
      };
    })(newWin);
  } catch (_) {}

  return newWin;
}
