import openNewWindow from '../../lib/open-new-window';

const q = prompt('What are you looking for?', '');
if (q) {
  openNewWindow('https://www.google.com/search?q=' + encodeURIComponent(q));
}
