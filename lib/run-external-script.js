import * as document from 'document';
import { dummyParam } from './common';

export default function runExternalScript(url) {
  try {
    const script = document.createElement('script');
    script.setAttribute('src', url + dummyParam());
    // [Drop IE] use append and remove
    // eslint-disable-next-line unicorn/prefer-node-append
    document.head.appendChild(script);
    // eslint-disable-next-line unicorn/prefer-node-remove
    document.head.removeChild(script);
  } catch (error) {
    console.error(error);
  }
}
