// describe('applyUnitToValue()', () => {
//   it('does nothing to strings', () => {
//     expect(applyUnitToValue('display', 'foo', 'px')).toBe('foo');
//     expect(applyUnitToValue('display', '100px', 'px')).toBe('100px');
//     expect(applyUnitToValue('display', 'red', 'px')).toBe('red');
//   });

//   it('does nothing to zeros', () => {
//     expect(applyUnitToValue('width', 0, 'px')).toBe('0');
//   });

//   it('does nothing to unitless properties', () => {
//     expect(applyUnitToValue('lineHeight', 1.5, 'px')).toBe('1.5');
//   });

//   it('does nothing if a unit already exists', () => {
//     expect(applyUnitToValue('width', '100em', 'px')).toBe('100em');
//     expect(applyUnitToValue('height', '10vh', 'px')).toBe('10vh');
//   });

//   it('appends px to numbers', () => {
//     expect(applyUnitToValue('width', 100, 'px')).toBe('100px');
//   });

//   it('can customize unit', () => {
//     expect(applyUnitToValue('width', 100, 'em')).toBe('100em');
//   });
// });
