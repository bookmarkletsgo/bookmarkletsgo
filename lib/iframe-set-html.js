// target: iframe object or window object
export default function updateHtml(target, html, options) {
  options = Object.assign({ enableScript: true }, options);
  const document = target.contentDocument || target.document;

  if (!document || !document.documentElement) {
    return false;
  }

  document.documentElement.innerHTML = html;

  if (options.enableScript) {
    document.querySelectorAll('script').forEach((s) => {
      try {
        const t = document.createElement('script');
        s.getAttributeNames().forEach((name) => {
          t.setAttribute(name, s.getAttribute(name));
        });

        if (s.textContent) {
          t.textContent = s.textContent;
        }

        s.remove();
        document.head.append(t);
      } catch (_) {}
    });
  }
}
