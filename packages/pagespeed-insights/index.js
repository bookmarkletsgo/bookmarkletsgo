import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

openNewWindow(
  'https://developers.google.com/speed/pagespeed/insights/?url=' +
    encodeURIComponent(location.href)
);
