import * as document from 'document';

export const createElement = (tag) => document.createElement(tag);
// export const createElement = document.createElement.bind(document);

export const querySelector = (q) => document.querySelector(q);

export const querySelectorAll = (q) => document.querySelectorAll(q);

export const addEventListener = (object, type, handler) => {
  if (object) {
    object.addEventListener(type, handler, false);
  }
};

export const hasClass = (object, key) => object.classList.contains(key);

export const forEach = Function.call.bind([].forEach);

export const getAbsoluteUrl = (() => {
  let a;

  return (url) => {
    if (!a) a = document.createElement('a');
    a.href = url;

    return a.href;
  };
})();
