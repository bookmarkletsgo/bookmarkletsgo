import bind from './bind';
import * as document from 'document';

export const querySelector = bind(document.querySelector, document);
