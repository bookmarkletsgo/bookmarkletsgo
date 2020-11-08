import * as document from 'document';
import { isIE } from '../../lib/common';

const body = document.body;
const contentEditable = 'contentEditable';
const designMode = 'designMode';
if (body.getAttribute(contentEditable) === 'true') {
  body.removeAttribute(contentEditable);
  if (!isIE()) {
    document[designMode] = 'off';
  }
} else {
  body.setAttribute(contentEditable, 'true');
  if (!isIE()) {
    document[designMode] = 'on';
  }
}
