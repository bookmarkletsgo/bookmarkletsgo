import * as p from './polyfill/exports';
import { forEach } from './array-foreach';
import { slice } from './array-slice';
import { isIE } from './common';
// target: iframe object or window object
export default function updateHtml(target, html, options) {
  if (!target) {
    return false;
  }

  options = Object.assign({ enableScript: true }, options);
  let document = null;
  try {
    document = target.contentDocument || target.document;
  } catch (_) {}

  if (!document || !document.documentElement) {
    return false;
  }

  // document.documentElement.innerHTML = html;
  try {
    document.documentElement.innerHTML = html;
  } catch (_) {
    // [IE 8,9]
    try {
      document.write(html);
      return;
    } catch (error) {
      console.log(error);
      alert('Do not support this browser or this site.');
      return;
    }
  }

  if (options.enableScript) {
    if (isIE()) {
      const window = target.contentWindow || target;
      p.apply(window, [
        p.Element.getAttributeNames,
        p.Element.append,
        p.Element.remove
      ]);
    }

    // [IE]: Use slice() to clone Array
    forEach(slice(document.querySelectorAll('script')), (s) => {
      try {
        const t = document.createElement('script');
        forEach(s.getAttributeNames(), (name) => {
          t.setAttribute(name, s.getAttribute(name));
        });

        if (s.textContent) {
          t.textContent = s.textContent;
        }

        s.remove();
        document.head.append(t);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
