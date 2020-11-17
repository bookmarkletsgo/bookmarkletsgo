import { forEach } from '../../lib/array-foreach';
import { blockEventListeners } from '../../lib/block-event-listeners';

function applyTo(window) {
  blockEventListeners(window, [
    'mousedown',
    'mouseup',
    'selectstart',
    'dragstart'
  ]);

  try {
    const body = window.document.body;
    if (body && body.style.MozUserSelect !== undefined) {
      body.style.MozUserSelect = 'auto';
    }
  } catch (_) {}
}

function recursion(window) {
  applyTo(window);
  if (window.frames.length > 0) {
    forEach(window.frames, (w) => recursion(w));
  }
}

recursion(window);
