import * as location from 'location';
import openNewWindow from '../../lib/open-new-window';

const url = 'https://www.alexa.com/siteinfo/' + location.hostname;
openNewWindow(url);
