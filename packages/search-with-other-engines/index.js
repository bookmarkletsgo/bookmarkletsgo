import openNewWindow from '../../lib/open-new-window';

const engines = [
  ['Google', 'https://www.google.com/search?q=%s'],
  ['Bing', 'https://www.bing.com/search?q=%s'],
  ['Yahoo', 'https://search.yahoo.com/search?q=%s'],
  ['Duckduckgo', 'https://duckduckgo.com/?q=%s'],
  [
    'Wikipedia',
    'https://en.wikipedia.org/wiki/Special:Search?search=%s&sourceid=BookmarkletsGo-search'
  ],
  ['Facebook', 'https://www.facebook.com/search/top/?q=%s&opensearch=1'],
  [
    'Amazon',
    'https://www.amazon.com/s?k=%s&link_code=qs&sourceid=BookmarkletsGo-search'
  ],
  ['Baidu', 'https://www.baidu.com/s?ie=utf-8&wd=%s'],
  [
    'Naver',
    'http://search.naver.com/search.naver?where=nexearch&sm=osd&ie=UTF-8&query=%s'
  ]
];
const engineNames = engines.map((value, index) => index + 1 + '. ' + value[0]);
const engineUrls = engines.map((value) => value[1]);

function getQuery() {
  const parameters = location.search.slice(1).split('&');
  for (let i = 0, length = parameters.length; i < length; i++) {
    // const [key, value] = parameters[i].split('=');
    const keyValue = parameters[i].split('=');
    const key = keyValue[0];
    const value = keyValue[1];
    if (key === 'q' || key === 'query' || key === 'search' || key === 'wd')
      if (value) {
        try {
          return decodeURIComponent(value.replace(/\+/g, ' '));
        } catch (error) {
          console.error(error);
          return value;
        }
      }
  }

  return prompt('What are you looking for?', '');
}

function ask() {
  const index = prompt('Select search engine?\n' + engineNames.join('\n'), '');
  if (index !== null) {
    const engine = engineUrls[index - 1];
    if (engine) {
      const query = getQuery();
      if (query) {
        openNewWindow(engine.replace('%s', encodeURIComponent(query)));
      }
    } else {
      ask();
    }
  }
}

ask();
