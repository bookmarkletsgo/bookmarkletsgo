import * as window from 'window';
import { serverOrigin } from './config';

const store = {};
const fakeLocalStorage = {
  getItem(key) {
    return key in store ? store[key] : null;
  },
  setItem(key, value) {
    store[key] = value;
  }
};

export const localStorage =
  window.origin === serverOrigin ? window.localStorage : fakeLocalStorage;

// overwrite localStorage, prevent access from any where
Object.defineProperty(window, 'localStorage', {
  get: () => window.sessionStorage,
  configurable: true,
  enumerable: true
});
