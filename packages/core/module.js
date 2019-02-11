/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

// Our index re-exports TypeScript types, which Babel is unable to detect and omit.
// Because of this, Webpack and other bundlers attempt to import values that do not exist.
// To mitigate this issue, we need this module specific index file that manually exports.

const Aesthetic = require('./esm/Aesthetic').default;
const ClassNameAesthetic = require('./esm/ClassNameAesthetic').default;
const UnifiedSyntax = require('./esm/UnifiedSyntax').default;
const Ruleset = require('./esm/Ruleset').default;
const Sheet = require('./esm/Sheet').default;

Aesthetic.ClassNameAesthetic = ClassNameAesthetic;
Aesthetic.UnifiedSyntax = UnifiedSyntax;
Aesthetic.Ruleset = Ruleset;
Aesthetic.Sheet = Sheet;

module.exports = Aesthetic;
