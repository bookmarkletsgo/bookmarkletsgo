import openNewWindow from '../../lib/open-new-window';

const q = prompt('What are you looking for?', '');
if (q !== null) {
  openNewWindow(
    'https://www.google.com/search?q=site%3A' +
      location.hostname.replace(/^www\./, '') +
      ' ' +
      encodeURIComponent(q)
  );
}
