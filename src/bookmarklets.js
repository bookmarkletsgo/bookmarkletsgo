document.querySelectorAll('a').forEach((item) => {
  item.addEventListener(
    'click',
    (event) => {
      const script = decodeURIComponent(event.target.href.slice(11));
      // console.log(script);
      if (window.top !== window) {
        if (
          script.indexOf('void') === 0 ||
          script.indexOf("'use strict';void") === 0
        ) {
          window.top.postMessage(script, '*');
        }

        event.preventDefault();
      }

      return false;
    },
    false
  );
});
