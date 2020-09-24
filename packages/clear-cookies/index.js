(function (document, location) {
  if (!document.cookie) return;
  function setCookie(v) {
    // console.log(v);
    document.cookie = v;
  }

  const cookies = document.cookie.split('; ');
  for (let c = 0; c < cookies.length; c++) {
    const cookieBase =
      encodeURIComponent(cookies[c].split('=')[0]) +
      '=; expires=Thu, 01-Jan-1970 00:00:01 GMT';
    setCookie(cookieBase);
    const d = location.hostname.split('.');
    while (d.length > 1) {
      const cookieBase2 = cookieBase + '; domain=' + d.join('.') + '; path=';
      const p = location.pathname.split('/');
      setCookie(cookieBase2 + '/');
      while (p.length > 0) {
        setCookie(cookieBase2 + p.join('/'));
        p.pop();
      }

      d.shift();
    }
  }
})(document, window.location);

// console.log('current cookie: ' + document.cookie);
alert('done');
