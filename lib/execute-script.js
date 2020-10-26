export default function execute(script, callback) {
  let done = false;
  let error = null;
  const id = Math.random();
  window[id] = function () {
    done = true;
  };

  script = 'window[' + id + ']();' + script;

  try {
    // #1
    // eslint-disable-next-line no-new-func
    new Function(script)();

    // #2
    // eval(script);

    // #3
    // const scriptTag = document.createElement('script');
    // scriptTag.text = script;
    // document.body.append(scriptTag);
    // scriptTag.remove();

    // #4
    // const bookmarkletLink = document.createElement('a');
    // bookmarkletLink.href = 'javascript:' + script;
    // bookmarkletLink.click();
  } catch (error_) {
    console.error(error_);
    error = error_;
  }

  // check whether script executed then call the callback
  setTimeout(() => {
    delete window[id];
    if (typeof callback === 'function') callback(error, done);
  });
}

// test code
// const handler = (error, result) => {
//   console.log('result ' + result);
//   if (error) {
//     // console.log(error);
//   }
// };
// execute('console.log("hello")', handler);
// execute('console.log("hello2")', handler);
// execute('console.log("hello3")', 1000, handler);
// execute('setTimeout(() => console.log("hello4"), 100)', handler);
// execute('console.log("hello5"', handler);
// execute('console.log("hello6){"', handler);
