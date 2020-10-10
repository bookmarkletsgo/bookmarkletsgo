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
