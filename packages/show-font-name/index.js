(function (window) {
  function getSelectedNode() {
    const focusNode = window.getSelection().focusNode;
    return focusNode === null ? focusNode : focusNode.parentNode;
  }

  function getNodeFontStack(node) {
    return window.getComputedStyle(node).fontFamily;
  }

  function getFirstAvailableFont(fonts) {
    for (const font of fonts) {
      const fontName = font.trim().replace(/"/g, '');
      const isAvailable = document.fonts.check(`16px ${fontName}`);

      if (!isAvailable) continue;

      return fontName;
    }
  }

  const node = getSelectedNode();

  if (!node) {
    alert('Please select a string of text and try again.');
    return;
  }

  const fonts = getNodeFontStack(node).split(',');
  const firstAvailableFont = getFirstAvailableFont(fonts);

  alert(`Font: ${firstAvailableFont}`);
})(window);
