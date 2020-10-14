import * as document from 'document';
import * as location from 'location';

function sim(a, b) {
  // eslint-disable-next-line no-script-url
  if (a.protocol === 'javascript:') return 3;
  if (a.hostname !== b.hostname) return 0;
  if (fixPath(a.pathname) !== fixPath(b.pathname) || a.search !== b.search)
    return 1;
  return 2;
}

function fixPath(p) {
  p = (p.charAt(0) === '/' ? '' : '/') + p; /* many browsers */
  p = p.split('?')[0]; /* opera */
  return p;
}

let i;
let x;
for (i = 0; (x = document.links[i]); ++i) {
  x.style.borderStyle = 'solid';
  x.style.borderWidth = 'thin';
  x.style.borderColor = ['blue', 'red', 'orange', 'green'][sim(x, location)];
  // x.style.color = ['blue', 'red', 'orange', 'green'][sim(x, location)];
}
