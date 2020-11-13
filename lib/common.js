import * as document from 'document';
import { includes } from './array-includes';

/**
 * return: a function that removes the event listener previously registered.
 */
export const addEventListener = (target, type, listener, options) => {
  if (target) {
    target.addEventListener(type, listener, options || false);
    return () => {
      target.removeEventListener(type, listener, options || false);
    };
  }
};

export const addEventListenerX = (target, type, listener, options) => {
  return addEventListener(
    target,
    type,
    (event) => {
      if (event.target !== target) {
        event.preventDefault();
        return false;
      }

      listener(event);
    },
    options
  );
};

export const onDOMContentLoaded = (listener) => {
  return addEventListener(document, 'DOMContentLoaded', listener);
};

const getClassNames = (object) =>
  (object.getAttribute('class') || '').split(' ').filter((x) => Boolean(x));

export const hasClass = (object, key) =>
  // IE 9 : classList() x
  object.classList
    ? object.classList.contains(key)
    : includes(getClassNames(object), key);

export const addClass = (object, key) => {
  // IE 9 : classList() x
  // eslint-disable-next-line no-unused-expressions
  object.classList
    ? object.classList.add(key)
    : object.setAttribute(
        'class',
        getClassNames(object)
          .filter((x) => x !== key)
          .join(' ') +
          ' ' +
          key
      );
};

export const removeClass = (object, key) => {
  // IE 9 : classList() x
  // eslint-disable-next-line no-unused-expressions
  object.classList
    ? object.classList.remove(key)
    : // IE 9
      object.setAttribute(
        'class',
        getClassNames(object)
          .filter((x) => x !== key)
          .join(' ')
      );
};

export const isIE = () => 'documentMode' in document;
export const getIEVersion = () => document.documentMode || -1;

export const dummyParam =
  process.env.NODE_ENV === 'production'
    ? () => '?i=' + Math.floor(new Date().getTime() / 3600000)
    : () => '?i=' + Math.random();

export const toObject = (value) => {
  try {
    // eslint-disable-next-line no-new-object
    return typeof value === 'string' ? JSON.parse(value) : new Object(value);
  } catch (_) {
    return {};
  }
};
