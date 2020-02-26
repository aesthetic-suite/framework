import { hyphenate } from '@aesthetic/utils';

const unitlessProperties = new Set<string>();

[
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'fontWeight',
  'lineHeight',
  'opacity',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  // SVG
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
].forEach(property => {
  unitlessProperties.add(property);
  unitlessProperties.add(hyphenate(property));
});

export default function isUnitlessProperty(property: string): boolean {
  return unitlessProperties.has(property);
}
