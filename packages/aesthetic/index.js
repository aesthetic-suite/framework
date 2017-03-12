/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

exports.default = require('./lib/Aesthetic');
exports.Adapter = require('./lib/Adapter');
exports.ClassNameAdapter = require('./lib/ClassNameAdapter');
exports.ThemeProvider = require('./lib/ThemeProvider');
exports.createStyler = require('./lib/createStyler');
exports.classes = require('./lib/classes');

const PropTypes = require('react').PropTypes;

exports.ClassNamesPropType = PropTypes.objectOf(PropTypes.string);
exports.StylesPropType = PropTypes.objectOf(PropTypes.object);
exports.ClassOrStylesPropType = PropTypes.oneOfType([
  PropTypes.objectOf(PropTypes.string),
  PropTypes.objectOf(PropTypes.object),
]);
