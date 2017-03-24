/**
 * @copyright   2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

const PropTypes = require('react').PropTypes;
const Aesthetic = require('./lib/Aesthetic').default;

Aesthetic.Adapter = require('./lib/Adapter').default;
Aesthetic.ClassNameAdapter = require('./lib/ClassNameAdapter').default;
Aesthetic.ThemeProvider = require('./lib/ThemeProvider').default;
Aesthetic.createStyler = require('./lib/createStyler').default;
Aesthetic.classes = require('./lib/classes').default;

Aesthetic.ClassNamesPropType = PropTypes.objectOf(PropTypes.string);
Aesthetic.StylesPropType = PropTypes.objectOf(PropTypes.object);
Aesthetic.ClassOrStylesPropType = PropTypes.oneOfType([
  PropTypes.objectOf(PropTypes.string),
  PropTypes.objectOf(PropTypes.object),
]);

module.exports = Aesthetic;
