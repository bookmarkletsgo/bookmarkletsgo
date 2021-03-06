(function () {
  'use strict';

  const loc = {
    hash: '',
    host: 'github.com',
    hostname: 'github.com',
    href: 'https://github.com/bookmarkletsgo/bookmarkletsgo.github.io',
    origin: 'https://github.com',
    pathname: '/bookmarkletsgo/bookmarkletsgo.github.io',
    port: '',
    protocol: 'https:',
    search: ''
  };
  const doc = {
    title: 'Hello World',
    documentElement: {
      innerHTML: '<head></head><body>test</body>'
    }
  };

  const isClass = (fn) =>
    fn.toString().startsWith('class') ||
    (fn.prototype && Object.getOwnPropertyNames(fn.prototype).length > 1);

  function createProxy(target, proxy /* , options */) {
    const handler = {
      get(target0, prop, receiver) {
        if (prop === '__isProxy') {
          return true;
        }

        if (prop === '__target') {
          return target;
        }

        if (
          target === window &&
          (prop === 'window' ||
            prop === 'self' ||
            prop === 'parent' ||
            prop === 'top')
        ) {
          return receiver;
        }

        if (Object.prototype.hasOwnProperty.call(proxy, prop)) {
          return proxy[prop];
        }

        // return target[prop];
        const value = target[prop];
        // console.log(prop, value, typeof value);
        if (typeof value === 'function' && !isClass(value)) {
          return function () {
            return value.apply(target, arguments);
          };
        }

        return value;
      },
      set(target0, prop, value) {
        if (prop === '__isProxy' || prop === '__target') {
          return false;
        }

        if (
          target === window &&
          (prop === 'window' ||
            prop === 'self' ||
            prop === 'parent' ||
            prop === 'top')
        ) {
          return true;
        }

        target[prop] = value;
        //
        // if (Object.prototype.hasOwnProperty.call(proxy, prop)) {
        //   if (proxy[prop].__isProxy) {
        //     console.log('set ', prop);
        //     return;
        //   }
        //   proxy[prop] = target[prop];
        // }
        return true;
      },
      getOwnPropertyDescriptor(target0, prop) {
        const desc = Object.getOwnPropertyDescriptor(target, prop);
        if (desc) {
          desc.configurable = true;
        }

        return desc;
      }
    };

    // return new Proxy({}, handler);
    return new Proxy(Object.assign({}, target), handler);
  }

  const locationProxy = createProxy(
    window.location,
    Object.assign({}, loc, {
      toString() {
        return this.href;
      }
    })
  );

  const documentElementProxy = createProxy(
    window.document.documentElement,
    Object.assign({}, (doc || {}).documentElement)
  );

  const documentProxy = createProxy(
    window.document,
    Object.assign({}, doc, {
      location: locationProxy,
      documentElement: documentElementProxy
    })
  );

  const win = {
    location: locationProxy,
    document: documentProxy
  };
  const windowProxy = createProxy(window, win);

  (function (window, self, parent, top, location, document) {
    (function () {
      console.log(window.location.href);
      console.log(location.href);
      console.log(window.location.origin);
      console.log(location.pathname);
      console.log(window.location);
      console.log(String(window.location));
      console.log(window.document);
      console.log(window.document.title);
      console.log(document.title);
      console.log(document.location.href);
      console.log(document.documentElement.innerHTML);
      const self = 'self';
      console.log(self);
    })();
  })(
    windowProxy,
    windowProxy,
    windowProxy,
    windowProxy,
    locationProxy,
    documentProxy
  );
})();
