import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

openNewWindow(
  'http://cssstats.com/stats?url=' + encodeURIComponent(location.href)
);
