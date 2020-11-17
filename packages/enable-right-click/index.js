import { forEach } from '../../lib/array-foreach';
import { blockEventListeners } from '../../lib/block-event-listeners';

function applyTo(window) {
  blockEventListeners(window, 'contextmenu');
}

function recursion(window) {
  applyTo(window);
  if (window.frames.length > 0) {
    forEach(window.frames, (w) => recursion(w));
  }
}

recursion(window);
