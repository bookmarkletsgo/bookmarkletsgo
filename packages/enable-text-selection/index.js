function unbind(a) {
  const ona = 'on' + a;
  if (window.addEventListener)
    window.addEventListener(
      a,
      function (event_) {
        for (let n = event_.originalTarget; n; n = n.parentNode) n[ona] = null;
      },
      true
    );
  window[ona] = null;
  document[ona] = null;
  if (document.body) document.body[ona] = null;
}

unbind('click');
unbind('mousedown');
unbind('mouseup');
unbind('selectstart');
