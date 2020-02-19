import getDocumentStyleSheet from '../../src/helpers/getDocumentStyleSheet';

function getStyleElements(): string[] {
  return Array.from(document.querySelectorAll('style')).map(element =>
    element.id.replace('aesthetic-', ''),
  );
}

const ORDER = ['global', 'standard', 'conditions'];

describe('getDocumentStyleSheet()', () => {
  describe('inserts in correct order', () => {
    it('if standard -> global -> conditions', () => {
      getDocumentStyleSheet('standard');
      getDocumentStyleSheet('global');
      getDocumentStyleSheet('conditions');

      expect(getStyleElements()).toEqual(ORDER);
    });

    it('if standard -> conditions -> global', () => {
      getDocumentStyleSheet('standard');
      getDocumentStyleSheet('conditions');
      getDocumentStyleSheet('global');

      expect(getStyleElements()).toEqual(ORDER);
    });

    it('if conditions -> standard -> global', () => {
      getDocumentStyleSheet('conditions');
      getDocumentStyleSheet('standard');
      getDocumentStyleSheet('global');

      expect(getStyleElements()).toEqual(ORDER);
    });

    it('if conditions -> global -> standard', () => {
      getDocumentStyleSheet('conditions');
      getDocumentStyleSheet('global');
      getDocumentStyleSheet('standard');

      expect(getStyleElements()).toEqual(ORDER);
    });

    it('if global -> conditions -> standard', () => {
      getDocumentStyleSheet('global');
      getDocumentStyleSheet('conditions');
      getDocumentStyleSheet('standard');

      expect(getStyleElements()).toEqual(ORDER);
    });

    it('if global -> standard -> conditions', () => {
      getDocumentStyleSheet('global');
      getDocumentStyleSheet('standard');
      getDocumentStyleSheet('conditions');

      expect(getStyleElements()).toEqual(ORDER);
    });
  });
});
