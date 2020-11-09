import bind from './bind';
export const find = [].find
  ? bind([].find)
  : // IE
    // eslint-disable-next-line unicorn/prefer-array-find,unicorn/no-fn-reference-in-iterator
    (a, x) => a.filter(x)[0];
