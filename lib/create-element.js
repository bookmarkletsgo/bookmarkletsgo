import bind from './bind';
import * as document from 'document';

export const createElement = bind(document.createElement, document);
