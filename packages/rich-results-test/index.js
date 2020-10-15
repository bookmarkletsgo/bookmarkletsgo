import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

openNewWindow(
  'https://search.google.com/test/rich-results?utm_campaign=sdtt&utm_medium=message&url=' +
    encodeURIComponent(location.href) +
    '&user_agent=2'
);
