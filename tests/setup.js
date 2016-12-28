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

const chai = require('chai');
const cssbeautify = require('cssbeautify');

chai.Assertion.addMethod('css', function(str) {
  let css = cssbeautify(this._obj, {
    indent: '  ',
    autosemicolon: true,
  });

  // Some adapters add !important rules,
  // so let's remove them to make testing easier.
  css = css.replace(/ !important/g, '');

  new chai.Assertion(css).to.equal(str);
});
