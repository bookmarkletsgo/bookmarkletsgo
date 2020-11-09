import bind from './bind';
export const includes = [].includes
  ? bind([].includes)
  : // IE
    // eslint-disable-next-line unicorn/prefer-includes
    (a, x) => a.indexOf(x) >= 0;
