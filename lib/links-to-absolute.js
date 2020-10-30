import * as document from 'document';
import { querySelectorAll, forEach, getAbsoluteUrl } from './common';
import { href, src } from './property-names';

const replace = (item, name) => {
  const value = item[name];
  if (value && item.getAttribute(name) !== value) {
    // eslint-disable no-self-assign
    item[name] = value;
  }
};

export default function linksToAbsolute() {
  // <a> tags
  forEach(document.links, (item) => replace(item, href));

  // stylesheet tags
  forEach(querySelectorAll('link'), (item) => replace(item, href));

  // script tags
  forEach(querySelectorAll('script'), (item) => replace(item, src));

  forEach(querySelectorAll('img'), (item) => replace(item, src));

  forEach(querySelectorAll('form'), (item) => {
    replace(item, 'action');

    forEach(item.getAttributeNames(), (name) => {
      if (name.startsWith('data-') && name.endsWith('url')) {
        item.setAttribute(name, getAbsoluteUrl(item.getAttribute(name)));
      }
    });
  });
}
