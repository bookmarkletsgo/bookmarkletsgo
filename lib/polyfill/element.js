/* eslint-disable no-var,one-var,func-names,unicorn/prefer-node-append,unicorn/prefer-node-remove */

export function append(window) {
  var document = window.document,
    Object = window.Object;
  // ParentNode.append()
  (function (arr) {
    arr.forEach(function (item) {
      if (item) {
        var prototype = item.prototype;
        if (Object.prototype.hasOwnProperty.call(prototype, 'append')) {
          return;
        }

        Object.defineProperty(prototype, 'append', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function append() {
            var argArr = Array.prototype.slice.call(arguments),
              docFrag = document.createDocumentFragment();

            argArr.forEach(function (argItem) {
              var isNode = argItem instanceof window.Node;
              docFrag.appendChild(
                isNode ? argItem : document.createTextNode(String(argItem))
              );
            });

            this.appendChild(docFrag);
          }
        });
      }
    });
  })([window.Element, window.Document, window.DocumentFragment]);
}

export function remove(window) {
  var Object = window.Object;
  // ChildNode.remove()
  (function (arr) {
    arr.forEach(function (item) {
      if (item) {
        var prototype = item.prototype;
        if (Object.prototype.hasOwnProperty.call(prototype, 'remove')) {
          return;
        }

        Object.defineProperty(prototype, 'remove', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function remove() {
            this.parentNode.removeChild(this);
          }
        });
      }
    });
  })([window.Element, window.CharacterData, window.DocumentType]);
}

// Element.prototype.getAttributeNames()
export function getAttributeNames(window) {
  var prototype = window.Element.prototype;
  if (!prototype.getAttributeNames) {
    prototype.getAttributeNames = function () {
      var attributes = this.attributes;
      var length = attributes.length;
      var result = new Array(length);
      for (var i = 0; i < length; i++) {
        result[i] = attributes[i].name;
      }

      return result;
    };
  }
}
