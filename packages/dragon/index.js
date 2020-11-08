// Dragon.js 🐉 by tomhodgins
// https://github.com/tomhodgins/dragon

import * as document from 'document';
import { addEventListener } from '../../lib/common';
const parseInt = (x) => window.parseInt(x, 10);
// Let's create some variables we can use later. Since they will all equal nothing right now, we can say they are all equal to zero in one shot.
let grab = 0;
let startX = 0;
let startY = 0;
let oldTop = 0;
let oldLeft = 0;

// When you click, prevent the default behaviour for that event
addEventListener(
  document,
  'click',
  function (e) {
    e.preventDefault();
  },
  true
);

// On mousedown or touchstart, run the pick() function
addEventListener(document, 'mousedown', pick);
addEventListener(document, 'touchstart', pick);

// This is the pick function
function pick(e) {
  // Prevent the default action
  e.preventDefault();

  // If the element being clicked/tapped isn't the body or HTML element, do the following
  if (e.target !== document.documentElement && e.target !== document.body) {
    // Set 'grab' to the time right now
    grab = Date.now();

    // Add a 'data-drag' attribute to the picked element and assign the time they started grabbing it
    // e.target.dataset.drag = grab; // IE 11
    // eslint-disable-next-line unicorn/prefer-dataset
    e.target.setAttribute('data-drag', grab); // < IE 11

    // Add `position: relative;` to the picked element
    e.target.style.position = 'relative';

    // Remember the original `top: ;` and `left: ;` values, or if they aren't set yet go with 0 instead
    oldTop = e.target.style.top.split('px')[0] || 0;
    oldLeft = e.target.style.left.split('px')[0] || 0;

    // That's all we do for the element when we start clicking or tapping
  }

  // Let's remember the start x and y coordinates of the cursor when starting a click or tap
  startX = e.clientX || e.touches[0].clientX;
  startY = e.clientY || e.touches[0].clientY;
}

// All the time you move the mouse or drag your finger, run the function drag()
addEventListener(document, 'mousemove', drag);
addEventListener(document, 'touchmove', drag);

// This is the drag function
function drag(e) {
  // If grab isn't empty, there's currently an object being dragged, do this
  if (grab !== 0) {
    // Let's find the element on the page whose data-drag="" value matches the value of grab right now
    const element = document.querySelector('[data-drag="' + grab + '"]');
    if (!element) {
      return;
    }

    // And to that element, let the new value of `top: ;` be equal to the old top position, plus the difference between the original top position and the current cursor position
    element.style.top =
      parseInt(oldTop) +
      parseInt((e.clientY || e.touches[0].clientY) - startY) +
      'px';

    // And let the new value of `left: ;` be equal to the old left position, plus the difference between the original left position and the current cursor position
    element.style.left =
      parseInt(oldLeft) +
      parseInt((e.clientX || e.touches[0].clientX) - startX) +
      'px';

    // That's all we do for dragging elements
  }
}

// On mouseup or touchend, run the release() function
addEventListener(document, 'mouseup', release);
addEventListener(document, 'touchend', release);

// The release function empties grab, forgetting which element has been picked.
function release() {
  grab = 0;
}

// On mouseover, run the over() function
addEventListener(document, 'mouseover', over);

// This is the over() function
function over(e) {
  // Set the cursor to 'move' wihle hovering an element you can reposition
  e.target.style.cursor = 'move';

  // Add a green box-shadow to show what container your hovering on
  e.target.style.boxShadow = 'inset lime 0 0 1px, lime 0 0 1px';
}

// On mouseover, run the out() function
addEventListener(document, 'mouseout', out);

// This is the out() function
function out(e) {
  // Remove the move cursor and green box-shadow
  e.target.style.cursor = '';
  e.target.style.boxShadow = '';
}
