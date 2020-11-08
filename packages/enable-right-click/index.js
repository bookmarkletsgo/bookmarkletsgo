function applyTo(window) {
  try {
    console.log(window.location.href);
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.document.oncontextmenu = null;
  } catch (error) {
    console.log(error);
  }
}

function recursion(window) {
  applyTo(window);
  if (window.frames.length > 0) {
    Array.from(window.frames).forEach((w) => recursion(w));
  }
}

recursion(window);
