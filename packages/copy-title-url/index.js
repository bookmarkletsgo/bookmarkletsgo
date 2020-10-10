import * as document from 'document';
import * as location from 'location';
import copy from '../../lib/copy-common';

copy(`${document.title} ${location.href}`);
