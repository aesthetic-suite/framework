const React = require('react');

exports.classes = require('./lib/classNames').default;
exports.createStyler = require('./lib/createStyler').default;
exports.Adapter = require('./lib/Adapter').default;
exports.ClassNameAdapter = require('./lib/ClassNameAdapter').default;
exports.ClassNamesPropType = React.PropTypes.objectOf(React.PropTypes.string);
exports.ThemeProvider = require('./lib/ThemeProvider').default;
exports.default = require('./lib/Aesthetic').default;
