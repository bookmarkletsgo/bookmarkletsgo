import * as document from 'document';

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

export const hasClass = (object, key) =>
  object.classList
    ? object.classList.contains(key)
    : // eslint-disable-next-line  unicorn/prefer-includes
      (object.getAttribute('class') || '').split(' ').indexOf(key) >= 0;

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
