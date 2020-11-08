import * as window from 'window';

function getSelectedNode() {
  const focusNode = window.getSelection().focusNode;
  return focusNode === null ? focusNode : focusNode.parentNode;
}

function getNodeFontStack(node) {
  return window.getComputedStyle(node).fontFamily;
}

function getFirstAvailableFont(fonts) {
  for (let i = 0, len = fonts.length; i < len; i++) {
    const font = fonts[i];
    const fontName = font.trim().replace(/"/g, '');
    const isAvailable = document.fonts.check(`16px ${fontName}`);

    if (!isAvailable) continue;

    return fontName;
  }
}

if (document.fonts) {
  const node = getSelectedNode();

  if (node) {
    const fonts = getNodeFontStack(node).split(',');
    const firstAvailableFont = getFirstAvailableFont(fonts);

    alert(`Font: ${firstAvailableFont}`);
  } else {
    alert('Please select a string of text and try again.');
  }
} else {
  alert('Do not support this browser.');
}
