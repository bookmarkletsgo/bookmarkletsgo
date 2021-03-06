import * as window from 'window';
import * as p from '../../lib/polyfill/exports';
p.apply(window, [p.Element.append, p.Element.remove]);
import * as document from 'document';

const id = 'bookmarkletsgo_show-element-outlines_style';
let style = document.querySelector('#' + id);

if (style) {
  style.remove();
} else {
  style = document.createElement('style');
  style.innerHTML = '* {outline: 1px solid red !important}';
  style.id = id;
  document.head.append(style);
}
