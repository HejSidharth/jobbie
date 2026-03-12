let idCounter = 0;

export function createId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter.toString(36)}`;
}
