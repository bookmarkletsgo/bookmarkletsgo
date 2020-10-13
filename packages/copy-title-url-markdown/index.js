import * as document from 'document';
import * as location from 'location';
import copy from '../../lib/copy-common';

const url = location.href;
if (url.includes(')')) {
  copy(`[${document.title}](<${url}>)`);
} else {
  copy(`[${document.title}](${url})`);
}
