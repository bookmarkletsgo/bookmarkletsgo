export default function iframeSetHtml(iframe, html) {
  // const window = iframe.contentWindow;
  const document = iframe.contentDocument;

  if (!document || !document.documentElement) {
    return false;
  }

  document.documentElement.innerHTML = html;

  // execute inline scripts
  document.querySelectorAll('script').forEach((s) => {
    try {
      // if (s.textContent) {
      //   window.eval(s.textContent);
      // }
      const ss = document.createElement('script');
      if (s.src) {
        ss.src = s.src;
      }

      if (s.textContent) {
        ss.textContent = s.textContent;
      }

      s.remove();
      document.head.append(ss);
    } catch (_) {
      // console.log(_);
      // console.log(s.innerText);
    }
  });
}
