import { serverOrigin } from './config';

export default function getPackageJsUrl(name) {
  return serverOrigin + '/packages/' + name + '/index.js';
}
