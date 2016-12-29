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
const css = require('css');
const perfectionist = require('perfectionist');
const sort = require('css-ast-diff/lib/sorters/ast');

function ast(str) {
  // Some adapters add !important rules,
  // so let's remove them to make testing easier.
  str = str.replace(/ !important/g, '');

  // Parse and build the AST
  str = css.stringify(sort(css.parse(str)), {
    compress: true,
  });

  // Format it to look pretty
  str = perfectionist.process(str, {
    cascade: false,
    indentSize: 2,
  }).css;

  // Remove double quotes because reasons
  str = str.replace(/"/g, '');

  return str;
}

chai.Assertion.addMethod('css', function(str) {
  new chai.Assertion(ast(this._obj)).to.equal(ast(str));
});
