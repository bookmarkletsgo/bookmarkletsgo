import * as window from 'window';
import * as p from '../../lib/polyfill/exports';
p.apply(window, [p.Element.append]);
import * as document from 'document';

const url = prompt('CSS URL', '');
if (url) {
  const link = document.createElement('link');
  // link.type = "text/css";
  link.rel = 'stylesheet';
  link.href = url;
  document.querySelectorAll('head')[0].append(link);
}
