import { createElement } from './create-element';

export const getAbsoluteUrl = (() => {
  let a;

  return (url) => {
    if (!a) a = createElement('a');
    a.href = url;

    return a.href;
  };
})();
