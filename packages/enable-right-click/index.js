import { forEach } from '../../lib/array-foreach';

function applyTo(window) {
  try {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.document.oncontextmenu = null;
    window.document.addEventListener(
      'contextmenu',
      function (event) {
        event.cancelBubble = true;
        event.stopPropagation();
      },
      true
    );
  } catch (_) {}
}

function recursion(window) {
  applyTo(window);
  if (window.frames.length > 0) {
    forEach(window.frames, (w) => recursion(w));
  }
}

recursion(window);
