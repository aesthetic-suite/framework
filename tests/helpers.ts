export function cleanStyles(source) {
  return source.replace(/\n/g, '').replace(/\s{2,}/g, '');
}

export function renderJSSStyles(instance) {
  return cleanStyles(instance.sheet.toString());
}
