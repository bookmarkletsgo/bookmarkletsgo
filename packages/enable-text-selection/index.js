import { forEach } from '../../lib/array-foreach';

function applyTo(window) {
  try {
    const unbind = function (a) {
      const ona = 'on' + a;
      if (window.addEventListener)
        window.addEventListener(
          a,
          function (event) {
            event.cancelBubble = true;
            event.stopPropagation();
            for (let n = event.originalTarget; n; n = n.parentNode)
              n[ona] = null;
          },
          true
        );
      window[ona] = null;
      window.document[ona] = null;
      if (window.document.body) window.document.body[ona] = null;
    };

    // unbind('click');
    unbind('mousedown');
    unbind('mouseup');
    unbind('selectstart');
  } catch (_) {}
}

function recursion(window) {
  applyTo(window);
  if (window.frames.length > 0) {
    forEach(window.frames, (w) => recursion(w));
  }
}

recursion(window);
