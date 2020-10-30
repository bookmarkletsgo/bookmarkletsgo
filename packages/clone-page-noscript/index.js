import iframeSetHtml from '../../lib/iframe-set-html';
import linksToAbsolute from '../../lib/links-to-absolute';
import createEmptyWindow from '../../lib/create-empty-window';

linksToAbsolute();

let html = document.documentElement.innerHTML;
if (!html.includes('<base ')) {
  html = html.replace(/(<head[^>]*>)/, '$1<base href="' + location.href + '">');
}

iframeSetHtml(createEmptyWindow(), html, { enableScript: false });
