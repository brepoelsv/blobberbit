import {
  objs
} from './objects';

import vars from './variables';

import {
  userCellSprites
} from './proxy';

import CacheDatas, {
  cleanAll as CleanAllCacheData
} from './cacheDatas';

import {
  onDel,
} from './renderer';

export default () => {
  [
    objs.virusesIndex,
    objs.glueIndex,
    objs.bombIndex,
    objs.drunkIndex,
    objs.shootIndex,
    objs.x2Index,
    objs.x5Index,
    objs.extra1Index,
    objs.extra2Index,
    objs.extra3Index,
    objs.extra4Index,
    objs.extra5Index,
    objs.freezeIndex,
    objs.speedIndex,
    objs.botsIndex,
    objs.fireFoodIndex,
    objs.foodsIndex,
    objs.shieldIndex,
    objs.megaIndex,
    objs.bulletIndex
  ].forEach(e => CleanAllCacheData(e, { onDel }));

  // console.log(objs.usersIndex.toString());
  const playerNodes = [];
  for (const i in objs.usersIndex) {
    if (objs.usersIndex[i].id) {
      playerNodes.push(objs.usersIndex[i].id);
    }
    // const item = objs.usersIndex[i];
    // CacheDatas(
    //   [{__: [item.id]}],
    //   objs.usersIndex[item.id] || (objs.usersIndex[item.id] = {}),
    //   userCellSprites
    // );
  }
  CacheDatas([{__: playerNodes}], objs.usersIndex, userCellSprites);

  objs.viruses = [];
  objs.glue = [];
  objs.bomb = [];
  objs.drunk = [];
  objs.shoot = [];
  objs.x2 = [];
  objs.x5 = [];
  objs.extra1 = [];
  objs.extra2 = [];
  objs.extra3 = [];
  objs.extra4 = [];
  objs.extra5 = [];
  objs.freeze = [];
  objs.speed = [];
  objs.bots = [];
  objs.fireFood = [];
  objs.foods = [];
  objs.shield = [];
  objs.mega = [];
  objs.bullet = [];
  objs.users = [];
  objs.leaderBoard = [];
  objs.nodesOnScreen = [];
  objs.nodelist = [];
  objs.nodes = {};
  objs.fds = {};
  objs.playerCells = [];
  objs.blobs = [];
  vars.clearCache = true;
};
