const open = (url) => {
  // location.href = url;
  window.open(url, '_blank');
};

const q = prompt('What are you looking for?', '');
if (q) {
  open('https://www.google.com/search?q=' + encodeURIComponent(q));
}
