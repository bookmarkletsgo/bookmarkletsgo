import { getIEVersion, addEventListener, toObject } from './common';
import { serverOrigin as iframeOrigin } from './config';
import { APP_NAME as messageFrom } from './constants';
import { origin } from './property-names';

export const postMessage =
  getIEVersion() === 9
    ? (target, message) => {
        message.from = messageFrom;
        // [IE 9] convert message type from object to string
        target.postMessage(JSON.stringify(message), '*');
      }
    : (target, message) => {
        message.from = messageFrom;
        target.postMessage(message, '*');
      };

export const addMessageHandler = (target, handler) => {
  const listener = (event) => {
    console.debug(event);
    const message = toObject(event.data);
    const messageOrigin = event[origin];
    const source = event.source;
    console.info(
      JSON.stringify({
        origin: messageOrigin,
        from: message.from,
        type: message.type,
        content: String(message.content).slice(0, 30)
      })
    );
    if (
      message.from === messageFrom &&
      (messageOrigin === iframeOrigin ||
        messageOrigin === target.location[origin] ||
        // compare with window.origin for cloned page(about:blank).
        messageOrigin === target[origin] ||
        messageOrigin === 'about:' ||
        // message from pages using bookmarkletsgo (host)
        source === target.top ||
        (target.opener &&
          (source === target.opener || source === target.opener.top)))
    ) {
      handler(message, event);
    }
  };

  return addEventListener(target, 'message', listener);
};
