const message =
  'Cookies stored on this site:\n\n' +
  document.cookie.replace(/; /g, '\n') +
  '\n    ---- end ----';
console.log(message);
alert(message);
