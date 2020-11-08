import * as window from 'window';
import * as p from '../../lib/polyfill/exports';
p.apply(window, [p.Element.append]);

alert('hello world!');
const div = document.createElement('div');
div.innerHTML = 'hello world!';
document.body.append(div);
console.log('hello world!');
