/* Polyfill for String.prototype */

/* eslint-disable no-var,unicorn/prefer-includes,camelcase */
export function includes(window) {
  var prototype = window.String.prototype;
  // String.prototype.includes
  if (!prototype.includes) {
    prototype.includes = function (search, start) {
      'use strict';

      if (search instanceof RegExp) {
        throw new TypeError('first argument must not be a RegExp');
      }

      if (start === undefined) {
        start = 0;
      }

      return this.indexOf(search, start) !== -1;
    };
  }
}

export function startsWith(window) {
  var prototype = window.String.prototype;
  if (!prototype.startsWith) {
    prototype.startsWith = function (search, rawPos) {
      var pos = rawPos > 0 ? rawPos | 0 : 0;
      return this.slice(pos, pos + search.length) === search;
    };
  }
}

export function endsWith(window) {
  var prototype = window.String.prototype;
  if (!prototype.endsWith) {
    prototype.endsWith = function (search, this_len) {
      if (this_len === undefined || this_len > this.length) {
        this_len = this.length;
      }

      return this.slice(this_len - search.length, this_len) === search;
    };
  }
}
