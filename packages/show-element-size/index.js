(function(window, document) {
  const createElement = (tag) => document.createElement(tag);
	window.showElementSize = window.showElementSize || {};

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
		showElementSize.container.classList.add('bookmarkletsgo_show-element-size');
		document.body.append(showElementSize.container);

		showElementSize.overlay = createElement('div');
		showElementSize.overlay.classList.add('bookmarkletsgo_show-element-size__overlay');
		showElementSize.container.append(showElementSize.overlay);

		showElementSize.label = createElement('div');
		showElementSize.label.classList.add('bookmarkletsgo_show-element-size__label');
		showElementSize.container.append(showElementSize.label);

		showElementSize.update = (event) => {
			let rect = event.target.getBoundingClientRect();

			let overlayX = window.pageXOffset + rect.left;
			let overlayY = window.pageYOffset + rect.top;
			let overlayWidth = rect.width;
			let overlayHeight = rect.height;
			showElementSize.overlay.style.transform = `
				translate(${overlayX}px, ${overlayY}px)
				scale(${overlayWidth}, ${overlayHeight})
			`;

			let labelX = window.pageXOffset + event.clientX + 8;
			let labelY = window.pageYOffset + event.clientY + 16;
			showElementSize.label.style.transform = `translate(${labelX}px, ${labelY}px)`;

			let elementWidth = Math.round(rect.width);
			let elementHeight = Math.round(rect.height);
			showElementSize.label.innerText = `${elementWidth} × ${elementHeight}`;

			showElementSize.container.style.opacity = '1';
		};
	}

	if (showElementSize.isActive) {
		showElementSize.isActive = false;
		document.removeEventListener('mousemove', showElementSize.update);
		showElementSize.container.style.opacity = '0';
		return;
	}

	showElementSize.isActive = true;
	document.addEventListener('mousemove', showElementSize.update, false);
})(window, document);
