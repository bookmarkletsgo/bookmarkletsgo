import bind from './bind';
import * as document from 'document';

export const querySelectorAll = bind(document.querySelectorAll, document);
