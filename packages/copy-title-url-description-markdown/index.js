import * as document from 'document';
import * as location from 'location';
import { querySelector } from '../../lib/common';
import copy from '../../lib/copy-common';

const url = (querySelector('link[rel="canonical"]') || location).href;
const description =
  (
    querySelector('meta[name="twitter:description"]') ||
    querySelector('meta[property="og:description"]') ||
    querySelector('meta[name="description"]') ||
    {}
  ).content || '';

if (url.includes(')')) {
  copy(`[${document.title}](<${url}>) - ${description}`);
} else {
  copy(`[${document.title}](${url}) - ${description}`);
}
