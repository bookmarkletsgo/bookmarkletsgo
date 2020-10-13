import * as document from 'document';

// export const createElement = (tag) => document.createElement(tag);
export const createElement = document.createElement.bind(document);
export const querySelector = document.querySelector.bind(document);
export const addEventListener = (object, type, handler) => {
  if (object) {
    object.addEventListener(type, handler, false);
  }
};
