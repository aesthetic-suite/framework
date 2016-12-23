/* eslint-disable */

const document = require('jsdom').jsdom('<!DOCTYPE html><html><body></body></html>');
const window = document.defaultView;

global.document = document;
global.window = window;

for (let key in window) {
  if (!window.hasOwnProperty(key)) {
    continue;
  }

  if (key in global) {
    continue;
  }

  global[key] = window[key];
}

global.createStyleTag = function(id) {
  const style = document.createElement('style');
  style.id = id;
  style.type = 'text/css';

  document.head.appendChild(style);

  return style;
}
