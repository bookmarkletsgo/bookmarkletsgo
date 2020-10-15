import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

openNewWindow(
  'https://mxtoolbox.com/SuperTool.aspx?action=a%3a' +
    location.hostname +
    '&run=toolpage'
);
