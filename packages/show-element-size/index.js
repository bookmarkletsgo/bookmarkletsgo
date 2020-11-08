import * as window from 'window';
import * as p from '../../lib/polyfill/exports';
p.apply(window, [p.Element.append]);
import * as document from 'document';
import { addEventListener } from '../../lib/common';
import { removeEventListener } from '../../lib/property-names';
import { createElement } from '../../lib/create-element';
import { setAttribute } from '../../lib/set-attribute';

if (typeof window.pageXOffset === 'number') {
  const showElementSize = window.showElementSize || {};
  // eslint-disable-next-line no-import-assign
  window.showElementSize = showElementSize;

  if (typeof showElementSize.isActive === 'undefined') {
    showElementSize.isActive = false;

    showElementSize.style = createElement('style');
    showElementSize.style.innerHTML = `
			.bookmarkletsgo_show-element-size {
				z-index: 1000000000;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				pointer-events: none;
				outline: 0 !important;
			}
			.bookmarkletsgo_show-element-size__overlay {
				width: 1px;
				height: 1px;
				background-color: rgba(255, 0, 0, .25);
				transform-origin: 0 0;
				transition: transform 50ms ease;
				outline: 0 !important;
			}
			.bookmarkletsgo_show-element-size__label {
				padding: .25rem .5rem;
				border: .125rem solid rgba(255, 255, 255, 1);
				border-radius: .25rem;
				background-color: rgba(0, 0, 0, 1);
				font-family: BlinkMacSystemFont, 'Segoe UI', sans-serif;
				color: rgba(255, 255, 255, 1);
				font-size: 1rem;
				line-height: 1.5rem;
				transform-origin: 0 0;
				outline: 0 !important;
			}
		`;
    document.head.append(showElementSize.style);

    showElementSize.container = createElement('div');
    setAttribute(
      showElementSize.container,
      'class',
      'bookmarkletsgo_show-element-size'
    );
    document.body.append(showElementSize.container);

    showElementSize.overlay = createElement('div');
    setAttribute(
      showElementSize.overlay,
      'class',
      'bookmarkletsgo_show-element-size__overlay'
    );
    showElementSize.container.append(showElementSize.overlay);

    showElementSize.label = createElement('div');
    setAttribute(
      showElementSize.label,
      'class',
      'bookmarkletsgo_show-element-size__label'
    );
    showElementSize.container.append(showElementSize.label);

    showElementSize.update = (event) => {
      const rect = event.target.getBoundingClientRect();

      const overlayX = window.pageXOffset + rect.left;
      const overlayY = window.pageYOffset + rect.top;
      const overlayWidth = rect.width;
      const overlayHeight = rect.height;
      showElementSize.overlay.style.transform = `
				translate(${overlayX}px, ${overlayY}px)
				scale(${overlayWidth}, ${overlayHeight})
			`;

      const labelX = window.pageXOffset + event.clientX + 8;
      const labelY = window.pageYOffset + event.clientY + 16;
      showElementSize.label.style.transform = `translate(${labelX}px, ${labelY}px)`;

      const elementWidth = Math.round(rect.width);
      const elementHeight = Math.round(rect.height);
      showElementSize.label.textContent = `${elementWidth} × ${elementHeight}`;

      showElementSize.container.style.opacity = '1';
    };
  }

  if (showElementSize.isActive) {
    showElementSize.isActive = false;
    showElementSize[removeEventListener]();
    showElementSize.container.style.opacity = '0';
  } else {
    showElementSize.isActive = true;
    showElementSize[removeEventListener] = addEventListener(
      document,
      'mousemove',
      showElementSize.update
    );
  }
} else {
  // IE 8
  alert('Do not support this browser.');
}
