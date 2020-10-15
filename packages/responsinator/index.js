import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

openNewWindow(
  'http://www.responsinator.com/?url=' +
    encodeURIComponent(location.href) +
    '&scroll=ext'
);
