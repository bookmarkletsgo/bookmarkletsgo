'use strict';

function prepareFrame(window, document) {
  if (window.__BOOKMARKLETSGO_INITED) {
    document.querySelector('#bookmarklet_store').style.display = 'block';
    return;
  }

  const iframeOrigin =
    process.env.NODE_ENV === 'production'
      ? 'https://bookmarkletsgo.github.io'
      : 'http://localhost:8090';
  const iframeUrl = iframeOrigin + '/bookmarklets.html';

  window.__BOOKMARKLETSGO_INITED = true;
  window.addEventListener(
    'message',
    (event) => {
      if (event.origin !== iframeOrigin) return;

      const script = document.createElement('script');
      script.text = event.data;
      document.body.append(script);
      script.remove();
    },
    false
  );

  const ifrm = document.createElement('iframe');
  ifrm.setAttribute('src', iframeUrl);
  ifrm.style = 'width:100%;height:100%;border:0;margin:0;padding:0';
  const div = document.createElement('div');
  div.id = 'bookmarklet_store';
  div.style =
    'width:300px;height:300px;position:fixed;top:10px;right:10px;z-index:10000;background-color:#f2f2f2;opacity:85%;display:block';
  const closeBtn = document.createElement('div');
  closeBtn.style = 'width:20px;height:20px;position:fixed;top:20px;right:10px;';
  closeBtn.innerHTML = '<a href="#" style="text-decoration:none">x</a>';
  div.append(ifrm);
  div.append(closeBtn);
  closeBtn.firstChild.addEventListener('click', function (event) {
    document.querySelector('#bookmarklet_store').style.display = 'none';
    event.preventDefault();
    return false;
  });

  document.body.append(div);
}

prepareFrame(window, document);
