import Config from './config';
import vars   from './variables';

import {
  player
} from './player';

import cleanAllSocketCache from './cleanSocket';
// import chatClient          from './chat';
import setupSocket         from './setupSocket';
import GAMESTAT            from './gameStat';
// import target              from './target';
import animloop            from './animLoop';
import toggleGameMenu      from './gameMenu';

import {
  objs
} from './objects';

import {
  playerNameInput
} from './dom';

function sendUint8(a) {
  var msg = prepareData(1);
  msg.setUint8(0, a);
  wsSend(msg);
}

function prepareData(a) {
  return new DataView(new ArrayBuffer(a));
}

function wsSend(a) {
  vars.socket.send(a.buffer);
}

export function startGameFirst() {
  //debugger;
  toggleGameMenu(true);
  vars.playerName = 'spectate';
  vars.playerType = 'spectate';
  player.__smoothRate = 0.2;

  if (vars.socket) {
    vars.socket.close();
    vars.socket = null;
    vars.clearCache = false;

  }

  if (!vars.socket && vars.clearCache) {
    vars.socket = new WebSocket(vars.serverHost);
    vars.socket.binaryType = 'arraybuffer';

    setupSocket();
    let timer3 = setTimeout(function tick() {
      if (document.getElementById('gameAreaWrapper')) {
        document.getElementById('gameAreaWrapper').className = '';
        clearTimeout(timer3);
      } else {
        timer3 = setTimeout(tick, 100);
      }
    }, 100);

  }
  if (!vars.animLoopHandle) {
    animloop();
  }
}

export function startGame(type) {
  vars.playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '').substring(0, 25);
  vars.playerType = type;
  player.__smoothRate = type === 'spectate' ? 0.2 : Config.smoothRate;
  //console.log("vars.socket==>",vars.socket, "vars.clearCache==>", vars.clearCache);
  if (type === 'player') {
    if (vars.gameStart) {
      toggleGameMenu(false);
      GAMESTAT.resetData();
    } else if (type === 'spectate') {
      // vars.socket.emit('spectate', 'gameleader');
      toggleGameMenu(false);
    }
  }
  if (vars.socket) {
    vars.socket.close();
    vars.socket = null;
    vars.clearCache = false;
    cleanAllSocketCache();
  }

  if (!vars.socket && vars.clearCache) {
    vars.socket = new WebSocket(vars.serverHost);
    vars.socket.binaryType = 'arraybuffer';
    vars.clearCache = false;
    cleanAllSocketCache();
    setupSocket();
  } else if (type !== player.type) {
    player.name = vars.playerName;
    player.w = window.innerWidth;
    player.h = window.innerHeight;
    player.type = type;
    player.avatar =  $('#playerAvatar')[0]._src;
    // vars.socket.emit('forceupdate', player);
  } else if (type === player.type){
    vars.clearCache = false;
    cleanAllSocketCache();
    setupSocket();
  }
  if (!vars.animLoopHandle) {
    animloop();
    // vars.socket.emit('respawn');
  }
}
