import * as window from 'window';
import * as p from './polyfill/exports';
p.apply(window, [p.ObjectAssign]);

export function blockEventListeners(window, eventTypes, options) {
  options = Object.assign({}, options);
  eventTypes = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

  eventTypes.forEach((type) => {
    const ontype = 'on' + type;

    try {
      (function (arr) {
        arr.forEach((a) => {
          if (a) {
            a[ontype] = null;
            a.addEventListener(
              type,
              function (event) {
                // console.log(String(a), event.type, event.srcElement, event);
                event.cancelBubble = true;
                event.stopPropagation();
                event.stopImmediatePropagation();
                if (options.preventDefault) {
                  event.preventDefault();
                }
              },
              true
            );
          }
        });
      })([
        window.document.body,
        window.document.documentElement,
        window.document,
        window.window
      ]);

      const oldValue = window.Event.prototype.preventDefault;
      window.Object.defineProperty(window.Event.prototype, 'preventDefault', {
        value() {
          if (this.type === type) {
            console.trace(this.type, this.defaultPrevented, this);
            // do nothing
          } else {
            oldValue.call(this);
          }
        },
        writable: true,
        configurable: true
      });
    } catch (_) {}
  });
}
