import * as document from 'document';

const body = document.body;
const contentEditable = 'contentEditable';
const designMode = 'designMode';
if (body[contentEditable] === 'true') {
  body[contentEditable] = 'false';
  document[designMode] = 'off';
} else {
  body[contentEditable] = 'true';
  document[designMode] = 'on';
}
