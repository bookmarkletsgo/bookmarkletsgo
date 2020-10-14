import * as document from 'document';
import { createElement } from '../../lib/common';

let i;
let link;
let url;
let tooltip;
let tooltipInner;
for (i = 0; (link = document.links[i]); ++i) {
  url = link.href;
  link.title += ' ' + url;
  // x.appendChild(document.createTextNode(h));
  tooltip = createElement('span');
  tooltipInner = createElement('span');
  tooltip.style = 'position:relative;';
  tooltipInner.style =
    'position:absolute;top:3px;left:3px;white-space: nowrap;padding:3px;background:#f5f5f5;opacity:60%;color:black !important;font-size:12px !important;';
  tooltipInner.innerHTML = url;
  tooltip.append(tooltipInner);
  link.append(tooltip);
}
