import * as window from 'window';
import * as document from 'document';

const onload = function () {
  // eslint-disable-next-line no-undef
  if (_atc.xol) _adr.onReady();
  if (window.addthis_sendto)
    // eslint-disable-next-line no-undef
    addthis_sendto('bkmore', {
      // eslint-disable-next-line no-undef
      product: 'bmt-' + _atc.ver
    });
};

if (window._atc) {
  onload();
} else {
  const ol = window.addthis_onload || [];
  // eslint-disable-next-line camelcase
  window.addthis_product = 'bmt-250';
  const o = document.createElement('script');
  o.src =
    'https://s7.addthis.com/js/250/addthis_widget.js#domready=1&username=bookmarkletsgo';
  ol.push(onload);
  // eslint-disable-next-line camelcase
  window.addthis_onload = ol;
  document.querySelector('body').append(o);
}
