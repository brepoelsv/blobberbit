import {
  objs
} from './objects';

import SmoothAnimaiton from './smoothAnimation';

const noop = (e = {}) => 0;

export default (array = [], Index = {}, {
  onNew = noop,
  onDel = noop,
  onUpdate = noop
} = {}) => {
  const longTempIndex = Index._PrivateIndexed || (Index._PrivateIndexed = {});
  let index = 0;
  let delArray;

  if (array[0] && array[0].__) {
    delArray = array[0].__;
    array.shift();
  }

  for (const e of array) {
    const i = index ++;
    const id = e.id || (i + 1);
    if (!id) {
      throw new Error({
        err: 'EMPTY ID', array
      });
    }
    if (!Index[id]) {
      Index[id] = new SmoothAnimaiton(longTempIndex[id] = Object.assign(longTempIndex[id] || {}, e));
      onNew(Index[id]);
    } else {
      Index[id].update(e);
      Object.assign(longTempIndex[id], e);
      onUpdate(Index[id]);
    }
  }


  if (delArray) for (const e of delArray) {
    Index[e] && onDel(Index[e]);
    delete Index[e];
  }

  const result = [];
  for (let i in Index) {
    i != '_PrivateIndexed' && Index[i] && result.push(Index[i]);
  }

  return result;
};

export const cleanAll = (Index, {
  onDel = noop
} = {}) => {
  Index._PrivateIndexed = {};
  for (const i in Index) {
    i !== '_PrivateIndexed' && Index[i] && onDel(Index[i]);
    delete Index[i];
  }
};
