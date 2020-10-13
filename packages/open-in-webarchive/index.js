import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

const baseUrl = 'https://web.archive.org/web/*/';
const url = prompt('Use current URL or input an URL', location.href);
if (url !== null) {
  openNewWindow(baseUrl + (url || location.href));
}
