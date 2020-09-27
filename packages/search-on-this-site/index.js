const open = (url) => {
  // location.href = url;
  window.open(url, '_blank');
};

const q = prompt('What are you looking for?', '');
if (q !== null) {
  open(
    'https://www.google.com/search?q=site%3A' +
      location.hostname.replace(/^www\./, '') +
      ' ' +
      encodeURIComponent(q)
  );
}
