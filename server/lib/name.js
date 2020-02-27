import {
  nameIndex
} from './object/';

export function nameGenerate() {
  let calcIndex = nameIndex.indexOf(false);
  if (calcIndex === -1) {
    calcIndex = nameIndex.length;
  }
  nameIndex[calcIndex] = 1;
  return `blobber${calcIndex}`;
}

export function releaseName(name) {
  name = (name || '') + '';
  if (/^(blobber([1-9][0-9]*))$/u.test(name)) {
    const index = name.replace('blobber', '') * 1;
    nameIndex[index] = false;
  }
}
