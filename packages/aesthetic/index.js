/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

const PropTypes = require('react').PropTypes;

exports.default = require('./lib/Aesthetic').default;
exports.Adapter = require('./lib/Adapter').default;
exports.ClassNameAdapter = require('./lib/ClassNameAdapter').default;
exports.ThemeProvider = require('./lib/ThemeProvider').default;
exports.createStyler = require('./lib/createStyler').default;
exports.classes = require('./lib/classes').default;

exports.ClassNamesPropType = PropTypes.objectOf(PropTypes.string);
exports.StylesPropType = PropTypes.objectOf(PropTypes.object);
exports.ClassOrStylesPropType = PropTypes.oneOfType([
  PropTypes.objectOf(PropTypes.string),
  PropTypes.objectOf(PropTypes.object),
]);
