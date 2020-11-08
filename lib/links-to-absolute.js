import * as window from 'window';
import * as p from './polyfill/exports';
p.apply(window, [
  p.String.startsWith,
  p.String.endsWith,
  p.Element.getAttributeNames
]);
import * as document from 'document';
import { getAbsoluteUrl } from './get-absolute-url';
import { querySelectorAll } from './query-selector-all';
import { forEach } from './array-foreach';
import { href, src } from './property-names';
import { setAttribute } from './set-attribute';
import { getAttribute } from './get-attribute';

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
        setAttribute(item, name, getAbsoluteUrl(getAttribute(item, name)));
      }
    });
  });
}
