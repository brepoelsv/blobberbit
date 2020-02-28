import hexToHsl from 'hex-to-hsl';

import vars, {
  baseWidth,
  baseHeight
} from './variables';

import {
  player
} from './player';

import {
  graph,
  renderer,
  //scoreId,
  coordinatesId,
  // massId,
  rightBonuses,
  bottomBonuses, cellId,
} from './dom';

import sprites from '../js/sprites.js';

import {
  randomProperty,
  valueInRange,
} from '../../server/lib/util';

import {
  glueImage,
  shieldImage,
  bombImage,
  drunkImage,
  shootImage,
  extra1Image,
  extra2Image,
  extra3Image,
  extra4Image,
  extra5Image,
  freezeImage,
  speedImage
} from './objectImages';

import {
  foodsSprites,
  virusesSprites,
  glueSprites,
  bombSprites,
  drunkSprites,
  shootSprites,
  x5Sprites,
  extra1Sprites,
  extra2Sprites,
  extra3Sprites,
  extra4Sprites,
  extra5Sprites,
  freezeSprites,
  speedSprites,
  userCellSprites,
  shieldSprite,
  x2Sprites,
  megaSprites
} from './proxy';

import miniMap from './minimap';

import {
  objs
} from './objects';

import CacheDatas from './cacheDatas';

import GAMESTAT from './gameStat';

import toggleGameMenu from './gameMenu';
import { startGame } from './startGame';

let chatBoard = [];
let canvasChat = $('<canvas id="canvasChat"/>').attr({
  width: 210,
  height: 500
}).appendTo('body').get(0);
const ctxChat = canvasChat.getContext('2d');
const canvasLeaderboard = $('<canvas id="canvasLeaderboard"/>').attr({
  width: 250,
  height: 500
}).appendTo('body').get(0);
const ctxLeaderboard = canvasLeaderboard.getContext('2d');
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

const userData   = [];
const foodsList  = [];
const glueList   = [];
const shieldList = [];
const bombList   = [];
const drunkList  = [];
const megaList   = [];
const shootList  = [];
const x2List     = [];
const x5List     = [];
const extra1List = [];
const extra2List = [];
const extra3List = [];
const extra4List = [];
const extra5List = [];
const freezeList = [];
const speedList  = [];
const massList   = [];
const virusList  = [];
const botsList   = [];
const bulletList = [];

function onZoom(e) {
 // vars.zoom *= Math.pow(1.1, e.deltaY / 100);
  vars.zoom = valueInRange(0.2, 4, renderer.zoom);
  renderer.zoom = vars.zoom;
}

function UText(usize, ucolor, ustroke, ustrokecolor) {
  usize && (this._size = usize);
  ucolor && (this._color = ucolor);
  this._stroke = !!ustroke;
  ustrokecolor && (this._strokeColor = ustrokecolor);
}

UText.prototype = {
  _value: '',
  _color: '#000000',
  _stroke: false,
  _strokeColor: '#000000',
  _size: 16,
  _canvas: null,
  _ctx: null,
  _dirty: false,
  _scale: 1,
  setSize: function(a) {
    if (this._size !== a) {
      this._size = a;
      this._dirty = true;
    }
  },
  setScale: function(a) {
    if (this._scale !== a) {
      this._scale = a;
      this._dirty = true;
    }
  },
  setStrokeColor: function(a) {
    if (this._strokeColor !== a) {
      this._strokeColor = a;
      this._dirty = true;
    }
  },
  setValue: function(a) {
    if (a !== this._value) {
      this._value = a;
      this._dirty = true;
    }
  },
  render: function() {
    if (null === this._canvas) {
      this._canvas = document.createElement('canvas');
      this._ctx = this._canvas.getContext('2d');
    }
    if (this._dirty) {
      this._dirty = false;
      const canvas = this._canvas;
      const ctx = this._ctx;
      const value = this._value;
      const scale = this._scale;
      const fontsize = this._size;
      const font = fontsize + 'px Ubuntu';
      ctx.font = font;
      const h = ~~(.2 * fontsize);
      const wd = fontsize * 0.1;
      const h2 = h * 0.5;
      canvas.width = ctx.measureText(value).width * scale + 3;
      canvas.height = (fontsize + h) * scale;
      ctx.font = font;
      ctx.globalAlpha = 1;
      ctx.lineWidth = wd;
      ctx.strokeStyle = this._strokeColor;
      ctx.fillStyle = this._color;
      ctx.scale(scale, scale);
      this._stroke && ctx.strokeText(value, 0, fontsize - h2);
      ctx.fillText(value, 0, fontsize - h2);
    }
    return this._canvas;
  },
  getWidth: function() {
    return (ctxChat.measureText(this._value).width + 6);
  }
};

function drawLeaderBoard() {
  ctxLeaderboard.clearRect(0, 0, 250, 500);
  let drawTeam = null !== vars.teamScores;
  if (drawTeam || 0 !== objs.leaderBoard.length) {
    if (drawTeam || vars.showName) {
      let boardLength = 60;
      boardLength = !drawTeam ? boardLength + 24 * objs.leaderBoard.length : boardLength + 180;
      //console.log(boardLength);
      const scaleFactor = Math.min(0.22 * canvasHeight, Math.min(200, .3 * canvasWidth)) * 0.005;

      //ctxLeaderboard.scale(scaleFactor, scaleFactor);  BUG LEADERBOARD SHRINKING
      //ctxLeaderboard.clearRect(0, 0, 200, boardLength);
      ctxLeaderboard.globalAlpha = .4;
      ctxLeaderboard.fillStyle = '#000000';
      ctxLeaderboard.fillRect(0, 0, 250, boardLength);

      ctxLeaderboard.globalAlpha = 1;
      ctxLeaderboard.fillStyle = '#FFFFFF';
      let a = 'Ranking';
      ctxLeaderboard.font = '30px Ubuntu';
      ctxLeaderboard.fillText(a, 100 - ctxLeaderboard.measureText(a).width * 0.5, 40);
      let b;
      let l;
      if (!drawTeam) {
        for (ctxLeaderboard.font = '20px Ubuntu', b = 0, l = objs.leaderBoard.length; b < l; ++b) {
          a = objs.leaderBoard[b].name || 'An unnamed cell';
          if (!vars.showName) {
            (a = 'An unnamed cell');
          }
          const me = -1 !== objs.nodesOnScreen.indexOf(objs.leaderBoard[b].id);
          if (me) objs.playerCells[0].name && (a = objs.playerCells[0].name);
          me ? ctxLeaderboard.fillStyle = '#FFAAAA' : ctxLeaderboard.fillStyle = '#FFFFFF';
          if (!vars.noRanking) a = b + 1 + '. ' + a;
          const start = (ctxLeaderboard.measureText(a).width > 200) ? 2 : 100 - ctxLeaderboard.measureText(a).width * 0.5;
          ctxLeaderboard.fillText(a, start, 70 + 24 * b);
        }
      } else {
        for (b = a = 0; b < vars.teamScores.length; ++b) {
          const d = a + vars.teamScores[b] * Math.PI * 2;
          ctxLeaderboard.fillStyle = vars.teamColor[b + 1];
          ctxLeaderboard.beginPath();
          ctxLeaderboard.moveTo(100, 140);
          ctxLeaderboard.arc(100, 140, 80, a, d, false);
          ctxLeaderboard.fill();
          a = d;
        }
      }
    }
  }
  objs.leaderBoard = [];
}

function drawChatBoard() {
  if (vars.hideChat)  {
    canvasChat = null;
    return;
  }
  const scaleFactor = Math.min(Math.max(canvasWidth / 1200, 0.75), 1); // scale factor = 0.75 to 1
  canvasChat.width = 1E3 * scaleFactor;
  canvasChat.height = 550 * scaleFactor;
  ctxChat.scale(scaleFactor, scaleFactor);
  const nowtime = Date.now();
  let lasttime = 0;
  if (chatBoard.length >= 1) {
    lasttime = chatBoard[chatBoard.length - 1].time;
  } else {
    return;
  }
  const deltat = nowtime - lasttime;
  ctxChat.globalAlpha = 0.8 * Math.exp(-deltat / 25000);

  const len = chatBoard.length;
  let from = len - 15;
  if (from < 0) {
    from = 0;
  }
  for (let i = 0; i < (len - from); i++) {
    const chatName = new UText(18, chatBoard[i + from].color);
    chatName.setValue(chatBoard[i + from].name);
    const width = chatName.getWidth();
    let a = chatName.render();
    ctxChat.drawImage(a, 15, canvasChat.height / scaleFactor - 24 * (len - i - from));

    const chatText = new UText(18, '#666666');
    chatText.setValue(':' + chatBoard[i + from].message);
    a = chatText.render();
    ctxChat.drawImage(a, 15 + width * 1.8, canvasChat.height / scaleFactor - 24 * (len - from - i));
  }
}

function addChat(view, offset) {
  function getString() {
    let text = '';
    let char;
    while ((char = view.getUint16(offset, true)) != 0) {
      offset += 2;
      text += String.fromCharCode(char);
    }
    offset += 2;
    return text;
  }

  let flags = view.getUint8(offset++);

  if (flags & 0x80) {
    // SERVER Message
  }

  if (flags & 0x40) {
    // ADMIN Message
  }

  if (flags & 0x20) {
    // MOD Message
  }

  let r = view.getUint8(offset++);
  let g = view.getUint8(offset++);
  let b = view.getUint8(offset++);
  let color = (r << 16 | g << 8 | b).toString(16);
  while (color.length < 6) {
    color = '0' + color;
  }
  color = '#' + color;
  chatBoard.push({
    'name': getString(),
    'color': color,
    'message': getString(),
    'time': Date.now()
  });
}

function Cell(uid, ux, uy, usize, ucolor, uname, uradius, a) {
  this.id = uid;
  this.size = usize;
  this.x = ux;
  this.y = uy;
  this.color = ucolor;
  this.skin = a;
  this._name = uname;
  this._radius = uradius;
  this.bonuses = {
    glue: {
      active: false,
      progress: 0
    },
    bomb: {
      active: false,
      progress: 0
    },
    drunk: {
      active: false,
      progress: 0
    },
    shoot: {
      active: false,
      progress: 0
    },
    freeze: {
      active: false,
      progress: 0
    },
    speed: {
      active: false,
      progress: 0
    },
    shield: {
      active: false,
      progress: 0
    },
    extra: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      active: false
    },
    got: {
      glue: {
        active: false,
        progress: 0
      },
      freeze: {
        active: false,
        progress: 0
      },
      drunk: {
        active: false,
        progress: 0
      }
    }
  };
  // this.oSize = this.size = usize;
  // this.ox = this.x = ux;
  // this.oy = this.y = uy;
  // this.points = [];
  // this.pointsAcc = [];
  // this.createPoints();
  // this.setName(uname)
}

Cell.prototype = {
  id: 0,
  name: null,
  x: 0,
  y: 0,
  size: 0,
  flag: 0,
  updateTime: 0,
  updateCode: 0,
  destroyed: false,
  isVirus: false,
  isEjected: false,
  isPlayer: false,
  isBonus: false,
  destroy: function() {
    let tmp;
    let len;
    for (tmp = 0, len = objs.nodelist.length; tmp < len; tmp++)
      if (objs.nodelist[tmp] === this) {
        objs.nodelist.splice(tmp, 1);
        break;
      }
    delete objs.nodes[this.id];
    tmp = objs.playerCells.indexOf(this);
    if (-1 !== tmp) {
      vars.ua = true;
      objs.playerCells.splice(tmp, 1);
    }
    tmp = objs.nodesOnScreen.indexOf(this.id);
    if (-1 !== tmp) objs.nodesOnScreen.splice(tmp, 1);
    this.destroyed = true;
  },
  setSize: function(a) {
    var m = ~~(this.size * this.size * 0.01);
  }
};

function rip() {
  vars.died = true;
  vars.playerType = 'player';
  vars.died = false;
  startGame();
  }



function ripold() {
  vars.died = true;
  vars.playerType = 'spectate';
  window.setTimeout(() => {
    const stat = {
      foodEaten: 0,
      maxMass: 0,
      timeAlive: 0,
      leaderTime: 0,
      blobEaten: 0,
      maxPos: 0,
      level: 0,
      progress: 0,
      progressbar: 0
    }
    document.getElementById('statWrapper').className = 'uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-animation-slide-top';
    GAMESTAT.getChart('gameStat');
    document.getElementById('foodEeaten').innerHTML = stat.foodEaten;
    document.getElementById('highMass').innerHTML = stat.maxMass;
    document.getElementById('timeAlive').innerHTML = stat.timeAlive;
    document.getElementById('leaderTime').innerHTML = stat.leaderTime;
    document.getElementById('cellEaten').innerHTML = stat.blobEaten;
    document.getElementById('topPosition').innerHTML = stat.maxPos;
      document.getElementById('progress-bar-star').innerHTML = stat.level;
      document.getElementById('progress-bar').innerHTML = stat.progress;
      document.getElementById('progress-bar').style.width = stat.progressbar + '%';
    document.getElementById('continuePlay').onclick = () => {
      document.getElementById('statWrapper').className = 'uk-hidden';
      document.getElementById('startMenuWrapper').className = 'uk-height-1-1 uk-flex uk-flex-center uk-flex-middle';
      document.getElementById('optionButtons').className = 'uk-hidden';
      document.getElementById('statsFPS').className = 'uk-hidden';
      document.getElementById('miniMap').className = 'uk-hidden';
      //document.getElementById('score').className = 'uk-hidden';
      document.getElementById('mass').className = 'uk-hidden';
      document.getElementById('coordinates').className = 'uk-hidden';
      document.getElementById('rightBonuses').className = 'uk-hidden';
      document.getElementById('bottomBonuses').className = 'uk-hidden';
      document.getElementById('chatbox').className = 'chatbox uk-form uk-hidden';
      // if (power) {
      //   dropPowers.each((i, link) => {
      //     if (link.name === power) {
      //       link.className = 'link-power power-current';
      //       document.getElementById('powerName').innerHTML = ` ${power} <i class="uk-icon-caret-up"></i> `;
      //     } else {
      //       link.className = 'link-power';
      //     }
      //   });
      // }
    };
    vars.died = false;
  }, 1000);
}


function updateNodes(view, offset) {
  userData.length = 0;
  virusList.length = 0;
  foodsList.length = 0;
  massList.length = 0;
  glueList.length = 0;
  bombList.length = 0;
  drunkList.length = 0;
  shootList.length = 0;
  x2List.length = 0;
  x5List.length = 0;
  extra1List.length = 0;
  extra2List.length = 0;
  extra3List.length = 0;
  extra4List.length = 0;
  extra5List.length = 0;
  freezeList.length = 0;
  speedList.length = 0;
  shieldList.length = 0;
  megaList.length = 0;
  let timestamp = +new Date;
  var code = Math.random();
  vars.ua = false;
  let queueLength = view.getUint16(offset, true);
  offset += 2;

  const playerNodes = [];
  const foodNodes = [];
  const virusNodes = [];
  const ejectedNodes = [];
  const bonusNodes = {
    glueNodes: [],
    bombNodes: [],
    drunkNodes: [],
    shootNodes: [],
    x2Nodes: [],
    x5Nodes: [],
    extra1Nodes: [],
    extra2Nodes: [],
    extra3Nodes: [],
    extra4Nodes: [],
    extra5Nodes: [],
    freezeNodes: [],
    speedNodes: [],
    shieldNodes: [],
    megaNodes: []
  };
  for (var i = 0; i < queueLength; ++i) {
    //console.log(objs.nodes[view]);
    const killer = objs.nodes[view.getUint32(offset, true)];
    const killedNode = objs.nodes[view.getUint32(offset + 4, true)];
    if (killedNode === 'undefined') {}
    else {
      offset += 8;
      if (killer && killedNode) {
        if (killedNode.isPlayer) {
          playerNodes.push(killedNode.id);
        }
        if (killedNode.isFood) {
          foodNodes.push(killedNode.id);
        }
        if (killedNode.isVirus) {
          virusNodes.push(killedNode.id);
        }
        if (killedNode.isEjected) {
          ejectedNodes.push(killedNode.id);
        }
        if (killedNode.isBonus) {
          switch (killedNode.bonusType) {
            case 1:
              bonusNodes.glueNodes.push(killedNode.id);
              break;
            case 2:
              bonusNodes.bombNodes.push(killedNode.id);
              break;
            case 3:
              bonusNodes.drunkNodes.push(killedNode.id);
              break;
            case 4:
              bonusNodes.shootNodes.push(killedNode.id);
              break;
            case 5:
              bonusNodes.x2Nodes.push(killedNode.id);
              break;
            case 6:
              bonusNodes.x5Nodes.push(killedNode.id);
              break;
            case 7:
              bonusNodes.extra1Nodes.push(killedNode.id);
              break;
            case 8:
              bonusNodes.extra2Nodes.push(killedNode.id);
              break;
            case 9:
              bonusNodes.extra3Nodes.push(killedNode.id);
              break;
            case 10:
              bonusNodes.extra4Nodes.push(killedNode.id);
              break;
            case 11:
              bonusNodes.extra5Nodes.push(killedNode.id);
              break;
            case 12:
              bonusNodes.freezeNodes.push(killedNode.id);
              break;
            case 13:
              bonusNodes.speedNodes.push(killedNode.id);
              break;
            case 14:
              bonusNodes.shieldNodes.push(killedNode.id);
              break;
            case 15:
              bonusNodes.megaNodes.push(killedNode.id);
              break;
          }
        }
        killedNode.destroy();
      }
    }
  }

  for (var i = 0;;) {
    let nodeid = view.getUint32(offset, true);
    // console.log(`L: ${nodeid}`);
    offset += 4;
    if (0 === nodeid) break;
    ++i;

    let posX = view.getInt32(offset, true);
    // console.log(`X: ${posX}`);
    offset += 4;
    let posY = view.getInt32(offset, true);
    // console.log(`Y: ${posY}`);
    offset += 4;
    let size = view.getInt16(offset, true);
    // console.log(`Size: ${size}`);
    offset += 2;

    const flags = view.getUint16(offset, true);
    offset += 2;
    const flagPlayer = !!(flags & 0x01);
    const flagFood = !!(flags & 0x80);
    const flagVirus = !!(flags & 0x10);
    const flagEjected = !!(flags & 0x40);
    const flagBonus = !!(flags & 0x20);
    let _skin = '';
    let totalMass = 0;
    let bonusType = -1;

    if (flagPlayer) {
      totalMass = view.getUint32(offset, true);
      offset += 4;
    }

    if (flagBonus) {
      bonusType = view.getUint8(offset++, true);
    }

    flags & 128 && (offset += 1);

    for (var r = view.getUint8(offset++), g = view.getUint8(offset++), b = view.getUint8(offset++), color = (r << 16 | g << 8 | b).toString(16); 6 > color.length;) {
      color = "0" + color;
    }

    const hslcolor = hexToHsl(color);
    const colorstr = hslcolor[0];

    if (flags & 0x04) {
      for (;;) { // skin name
        let t = view.getUint8(offset, true) & 0x7F;
        offset += 1;
        if (0 == t) break;
        _skin += String.fromCharCode(t);
      }
    }

    let name;
    if (flags & 0x08) {
      for (var char, name = '';;) { // nick name
        char = view.getUint16(offset, true);
        offset += 2;
        if (0 == char) break;
        name += String.fromCharCode(char);
      }
    }

    var node = null;
    if (objs.nodes.hasOwnProperty(nodeid)) {
      node = objs.nodes[nodeid];
      node.x = posX;
      node.y = posY;
      if (node.isPlayer) {
        userData.push({
          id: nodeid,
          x: posX,
          y: posY,
          radius: size,
          massTotal: totalMass,
          bonuses: node.bonuses,
          isPlayer: node.isPlayer
        });
      }
      if (node.isFood) {
        foodsList.push({
          id: nodeid,
          x: posX,
          y: posY,
          radius: size
        });
      }
      if (node.isVirus) {
        virusList.push({
          id: nodeid,
          x: posX,
          y: posY,
          radius: size
        });
      }
      if (node.isEjected) {
        massList.push({
          id: nodeid,
          x: posX,
          y: posY,
          radius: size
        });
      }
    } else {
      node = new Cell(nodeid, posX, posY, size, colorstr, name, totalMass, _skin);
      if (flagPlayer && !objs.nodes[nodeid]) {
        userData.push({
          id: nodeid,
          x: posX,
          y: posY,
          name: name,
          type: 'player',
          hue: colorstr,
          sprite: _skin,
          radius: size,
          massTotal: totalMass,
          bonuses: node.bonuses
        });
        //debugger;
      }
      if (flagFood && !objs.nodes[nodeid]) {
        foodsList.push({
          id: nodeid,
          x: posX,
          y: posY,
          hue: colorstr,
          radius: size
        });
      }
      if (flagVirus && !objs.nodes[nodeid]) {
        virusList.push({
          id: nodeid,
          x: posX,
          y: posY,
          hue: colorstr,
          radius: size
        });
      }
      if (flagEjected && !objs.nodes[nodeid]) {
        massList.push({
          id: nodeid,
          x: posX,
          y: posY,
          hue: colorstr,
          radius: size
        });
      }
      if (flagBonus && !objs.nodes[nodeid]) {
        switch (bonusType) {
          case 1:
            glueList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 2:
            bombList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 3:
            drunkList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 4:
            shootList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 5:
            x2List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 6:
            x5List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 7:
            extra1List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 8:
            extra2List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 9:
            extra3List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 10:
            extra4List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 11:
            extra5List.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 12:
            freezeList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 13:
            speedList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 14:
            shieldList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
          case 15:
            megaList.push({
              id: nodeid,
              x: posX,
              y: posY,
              radius: size
            });
            break;
        }
        node.bonusType = bonusType;
      }
      objs.nodes[nodeid] = node;
    }
    node.massTotal = totalMass;
    node.isPlayer = flagPlayer;
    node.isVirus = flagVirus;
    node.isEjected = flagEjected;
    node.isFood = flagFood;
    node.isBonus = flagBonus;
    node.nx = posX;
    node.ny = posY;
    node.size = size;
    // node.setSize(size);
    node.updateCode = code;
    node.updateTime = timestamp;
    node.flag = flags;

    // get bonuses
    if (flags & 0x01) {
      const glue = view.getUint8(offset++, true);
      if (glue & 0x02) {
        node.bonuses.glue.active = true;
        node.bonuses.glue.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.glue.active = false;
      }
      const bomb = view.getUint8(offset++, true);
      if (bomb & 0x02) {
        node.bonuses.bomb.active = true;
        node.bonuses.bomb.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.bomb.active = false;
      }
      const drunk = view.getUint8(offset++, true);
      if (drunk & 0x02) {
        node.bonuses.drunk.active = true;
        node.bonuses.drunk.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.drunk.active = false;
      }
      const shoot = view.getUint8(offset++, true);
      if (shoot & 0x02) {
        node.bonuses.shoot.active = true;
        node.bonuses.shoot.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.shoot.active = false;
      }
      const freeze = view.getUint8(offset++, true);
      if (freeze & 0x02) {
        node.bonuses.freeze.active = true;
        node.bonuses.freeze.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.freeze.active = false;
      }
      const speed = view.getUint8(offset++, true);
      if (speed & 0x02) {
        node.bonuses.speed.active = true;
        node.bonuses.speed.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.speed.active = false;
      }
      const shield = view.getUint8(offset++, true);
      if (shield & 0x02) {
        node.bonuses.shield.active = true;
        node.bonuses.shield.progress = view.getUint8(offset++, true);
      } else {
        node.bonuses.shield.active = false;
      }
      const extra = view.getUint8(offset++, true);
      if (extra & 0x02) {
        node.bonuses.extra.active = true;
      } else {
        node.bonuses.extra.active = false;
      }
      const extra1 = view.getUint8(offset++, true);
      if (extra1 & 0x02) {
        node.bonuses.extra['1'] = true;
      } else {
        node.bonuses.extra['1'] = false;
      }
      const extra2 = view.getUint8(offset++, true);
      if (extra2 & 0x02) {
        node.bonuses.extra['2'] = true;
      } else {
        node.bonuses.extra['2'] = false;
      }
      const extra3 = view.getUint8(offset++, true);
      if (extra3 & 0x02) {
        node.bonuses.extra['3'] = true;
      } else {
        node.bonuses.extra['3'] = false;
      }
      const extra4 = view.getUint8(offset++, true);
      if (extra4 & 0x02) {
        node.bonuses.extra['4'] = true;
      } else {
        node.bonuses.extra['4'] = false;
      }
      const extra5 = view.getUint8(offset++, true);
      if (extra5 & 0x02) {
        node.bonuses.extra['5'] = true;
      } else {
        node.bonuses.extra['5'] = false;
      }
      const gotGlue = view.getUint8(offset++, true);
      if (gotGlue & 0x02) {
        node.bonuses.got.glue.active = true;
      } else {
        node.bonuses.got.glue.active = false;
      }
      const gotFreeze = view.getUint8(offset++, true);
      if (gotFreeze & 0x02) {
        node.bonuses.got.freeze.active = true;
      } else {
        node.bonuses.got.freeze.active = false;
      }
      const gotDrunk = view.getUint8(offset++, true);
      if (gotDrunk & 0x02) {
        node.bonuses.got.drunk.active = true;
      } else {
        node.bonuses.got.drunk.active = false;
      }
    }

    // console.log(flags);
    // name && node.setName(name);
    if (-1 !== objs.nodesOnScreen.indexOf(nodeid) && -1 === objs.playerCells.indexOf(node)) {
      // console.log(nodesOnScreen);
      // document.getElementById("overlays").style.display = "none";
      objs.playerCells.push(node);
      if (1 === objs.playerCells.length) {
        player.x = node.x;
        player.y = node.y;
        vars.nodeX = node.x;
        vars.nodeY = node.y;
      }
    }
  }
  queueLength = view.getUint16(offset, true);
  offset += 2;
  for (i = 0; i < queueLength; i++) {
    var nodeId = view.getUint32(offset, true);
    offset += 4;
    // console.log(JSON.stringify(nodes[nodeId]));
    node = objs.nodes[nodeId];
    if (node) {
      if (objs.nodes[nodeId].isPlayer) {
        playerNodes.push(objs.nodes[nodeId].id);
      }
      if (objs.nodes[nodeId].isFood) {
        foodNodes.push(objs.nodes[nodeId].id);
      }
      if (objs.nodes[nodeId].isVirus) {
        virusNodes.push(objs.nodes[nodeId].id);
      }
      if (objs.nodes[nodeId].isEjected) {
        ejectedNodes.push(objs.nodes[nodeId].id);
      }
      if (objs.nodes[nodeId].isBonus) {
        switch (objs.nodes[nodeId].bonusType) {
          case 1:
            bonusNodes.glueNodes.push(objs.nodes[nodeId].id);
            break;
          case 2:
            bonusNodes.bombNodes.push(objs.nodes[nodeId].id);
            break;
          case 3:
            bonusNodes.drunkNodes.push(objs.nodes[nodeId].id);
            break;
          case 4:
            bonusNodes.shootNodes.push(objs.nodes[nodeId].id);
            break;
          case 5:
            bonusNodes.x2Nodes.push(objs.nodes[nodeId].id);
            break;
          case 6:
            bonusNodes.x5Nodes.push(objs.nodes[nodeId].id);
            break;
          case 7:
            bonusNodes.extra1Nodes.push(objs.nodes[nodeId].id);
            break;
          case 8:
            bonusNodes.extra2Nodes.push(objs.nodes[nodeId].id);
            break;
          case 9:
            bonusNodes.extra3Nodes.push(objs.nodes[nodeId].id);
            break;
          case 10:
            bonusNodes.extra4Nodes.push(objs.nodes[nodeId].id);
            break;
          case 11:
            bonusNodes.extra5Nodes.push(objs.nodes[nodeId].id);
            break;
          case 12:
            bonusNodes.freezeNodes.push(objs.nodes[nodeId].id);
            break;
          case 13:
            bonusNodes.speedNodes.push(objs.nodes[nodeId].id);
            break;
          case 14:
            bonusNodes.shieldNodes.push(objs.nodes[nodeId].id);
            break;
          case 15:
            bonusNodes.megaNodes.push(objs.nodes[nodeId].id);
            break;
        }
      }
      node.destroy();
    }
  }
  //console.log(objs.playerCells[0]);
  if (objs.playerCells.length > 0 && objs.nodes[objs.playerCells[0].id]) {
    player.x = objs.nodes[objs.playerCells[0].id].x;
    player.y = objs.nodes[objs.playerCells[0].id].y;
    mouseCoordinateChange();
  }

  if (playerNodes.length > 0) {
    userData.unshift({__: playerNodes});
  }

  if (virusNodes.length > 0) {
    virusList.unshift({__: virusNodes});
  }

  if (foodNodes.length > 0) {
    foodsList.unshift({__: foodNodes});
  }

  if (ejectedNodes.length > 0) {
    massList.unshift({__: ejectedNodes})
  }

  if (bonusNodes.glueNodes.length > 0) {
    glueList.unshift({__: bonusNodes.glueNodes});
  }

  if (bonusNodes.bombNodes.length > 0) {
    bombList.unshift({__: bonusNodes.bombNodes});
  }

  if (bonusNodes.drunkNodes.length > 0) {
    drunkList.unshift({__: bonusNodes.drunkNodes});
  }

  if (bonusNodes.shootNodes.length > 0) {
    shootList.unshift({__: bonusNodes.shootNodes});
  }

  if (bonusNodes.x2Nodes.length > 0) {
    x2List.unshift({__: bonusNodes.x2Nodes});
  }

  if (bonusNodes.x5Nodes.length > 0) {
    x5List.unshift({__: bonusNodes.x5Nodes});
  }

  if (bonusNodes.extra1Nodes.length > 0) {
    extra1List.unshift({__: bonusNodes.extra1Nodes});
  }

  if (bonusNodes.extra2Nodes.length > 0) {
    extra2List.unshift({__: bonusNodes.extra2Nodes});
  }

  if (bonusNodes.extra3Nodes.length > 0) {
    extra3List.unshift({__: bonusNodes.extra3Nodes});
  }

  if (bonusNodes.extra4Nodes.length > 0) {
    extra4List.unshift({__: bonusNodes.extra4Nodes});
  }

  if (bonusNodes.extra5Nodes.length > 0) {
    extra5List.unshift({__: bonusNodes.extra5Nodes});
  }

  if (bonusNodes.freezeNodes.length > 0) {
    freezeList.unshift({__: bonusNodes.freezeNodes});
  }

  if (bonusNodes.speedNodes.length > 0) {
    speedList.unshift({__: bonusNodes.speedNodes});
  }

  if (bonusNodes.shieldNodes.length > 0) {
    shieldList.unshift({__: bonusNodes.shieldNodes});
  }

  if (bonusNodes.megaNodes.length > 0) {
    megaList.unshift({__: bonusNodes.megaNodes});
  }
  //console.log(JSON.stringify(node));
  // ua && 0 == playerCells.length && showOverlays(false)
  if (vars.ua && 0 === objs.playerCells.length) {
    //console.log('Killed');
    //rip();
    respawn();
    // rip();  TOEVOEGEN AAN OPTIES BEGINSCHERM TODO
  }
}

function wsIsOpen() {
  return null != vars.socket && vars.socket.readyState == vars.socket.OPEN
}

function sendMouseMove() {
  if (wsIsOpen()) {
    let msg = vars.rawMouseX - window.innerWidth / 2;
    let b = vars.rawMouseY - window.innerHeight / 2;
    // console.log(`${rawMouseX}x${rawMouseX}   ${canvasHeight}x${canvasWidth}`);
    // console.log(`${msg}x${b}`);
    // 957x957   998x958
    if (64 <= msg * msg + b * b && !(.01 > Math.abs(vars.oldX - vars.X) && .01 > Math.abs(vars.oldY - vars.Y))) {
      vars.oldX = vars.X;
      vars.oldY = vars.Y;
      // console.log(`${X}x${Y}`);
      msg = prepareData(21);
      msg.setUint8(0, 16);
      msg.setFloat64(1, vars.X, true);
      msg.setFloat64(9, vars.Y, true);
      msg.setUint32(17, 0, true);
      wsSend(msg);
    }
  }
}

function mouseCoordinateChange() {
  vars.X = (vars.rawMouseX - window.innerWidth / 2) / vars.viewZoom + vars.nodeX;
  // console.log(`${vars.rawMouseX} ${canvasWidth} ${vars.viewZoom} ${vars.nodeX}`);
  // console.log(`X: ${X}`);
  vars.Y = (vars.rawMouseY - window.innerHeight / 2) / vars.viewZoom + vars.nodeY;
  // console.log(`Y: ${Y}`);
  // console.log(`X: ${X} Y: ${Y}`);
}

function sendChat(str) {
  if (wsIsOpen() && (str.length < 200) && (str.length > 0)) {
    // console.log(str);
    const msg = prepareData(2 + 2 * str.length);
    let offset = 0;
    msg.setUint8(offset++, 99);
    msg.setUint8(offset++, 0); // flags (0 for now)
    for (let i = 0; i < str.length; ++i) {
      msg.setUint16(offset, str.charCodeAt(i), true);
      offset += 2;
    }
    wsSend(msg);
  }
}

function sendUint8(a) {
  if (wsIsOpen()) {
    const msg = prepareData(1);
    msg.setUint8(0, a);
    wsSend(msg);
  }
}

function handleWsMessage(msg) {
  let offset = 0;
  let setCustomLB = false;

  function getString() {
    let text = '';
    let char;
    while ((char = msg.getUint16(offset, true)) !== 0) {
      offset += 2;
      text += String.fromCharCode(char);
    }
    offset += 2;
    return text;
  }

  240 === msg.getUint8(offset) && (offset += 5);
  // console.log(msg.getUint8(offset));
  switch (msg.getUint8(offset++)) {
    case 16: // update nodes
      updateNodes(msg, offset);
      break;
    case 17: // update position
      player.x = msg.getFloat32(offset, true);
      // posX = msg.getFloat32(offset, true);
      offset += 4;
      player.y = msg.getFloat32(offset, true);
      // posY = msg.getFloat32(offset, true);
      offset += 4;
      const size = msg.getFloat32(offset, true);
      // posSize = msg.getFloat32(offset, true);
      offset += 4;
      // console.log(`${x}x${y}x${size}`);
      break;
    case 20: // clear nodes
      objs.playerCells = [];
      objs.nodesOnScreen = [];
      break;
    case 21: // draw line
      // lineX = msg.getInt16(offset, true);
      offset += 2;
      // lineY = msg.getInt16(offset, true);
      offset += 2;
      // if (!drawLine) {
      //   drawLine = true;
      //   drawLineX = lineX;
      //   drawLineY = lineY;
      // }
      break;
    case 32: // add node
      objs.nodesOnScreen.push(msg.getUint32(offset, true));
      // console.log(msg.getUint32(offset, true));
      offset += 4;
      break;
    case 48: // update leaderboard (custom text)
      setCustomLB = true;
      vars.noRanking = true;
      const place = msg.getUint16(offset, true);
      // console.log(place);
      break;
    case 49:
      const LBNum = msg.getUint32(offset, true);
      //console.log(msg.getUint32(offset, true));
      offset += 4;
      for (let i = 0; i < LBNum; ++i) {
        objs.leaderBoard.push({
          name: getString()
        });
      }
      drawLeaderBoard();
      break;
    case 64: // set border
      // leftPos = msg.getFloat64(offset, true);
      offset += 8;
      // topPos = msg.getFloat64(offset, true);
      offset += 8;
      // rightPos = msg.getFloat64(offset, true);
      offset += 8;
      // bottomPos = msg.getFloat64(offset, true);
      offset += 8;
      // posX = (rightPos + leftPos) / 2;
      // posY = (bottomPos + topPos) / 2;
      // posSize = 1;
      if (0 === objs.playerCells.length) {
         //nodeX = posX;
         //nodeY = posY;
         //viewZoom = posSize;
      }
      break;
    case 88: // minimap
      objs.blobs = [];
      const miniNum = msg.getUint32(offset, true);
      offset += 4;
      for (let i = 0; i < miniNum; ++i) {
        const x = msg.getFloat32(offset, true);
        offset += 4;
        const y = msg.getFloat32(offset, true);
        offset += 4;
        objs.blobs.push({
          x,
          y
        });
      }
      break;
    case 99:
      addChat(msg, offset);
      break;
  }
}

function prepareData(a) {
  return new DataView(new ArrayBuffer(a));
}

function wsSend(a) {
  vars.socket.send(a.buffer);
}

function onWsOpen() {
  chatBoard.length = 0;
  userData.length = 0;
  foodsList.length = 0;
  glueList.length = 0;
  shieldList.length = 0;
  bombList.length = 0;
  drunkList.length = 0;
  megaList.length = 0;
  shootList.length = 0;
  x2List.length = 0;
  x5List.length = 0;
  extra1List.length = 0;
  extra2List.length = 0;
  extra3List.length = 0;
  extra4List.length = 0;
  extra5List.length = 0;
  freezeList.length = 0;
  speedList.length = 0;
  massList.length = 0;
  virusList.length = 0;
  bulletList.length = 0;
  let msg;
  msg = prepareData(5);
  msg.setUint8(0, 254);
  msg.setUint32(1, 11, true); // Protocol 11
  wsSend(msg);
  msg = prepareData(5);
  msg.setUint8(0, 255);
  msg.setUint32(1, 0, true);
  wsSend(msg);
  if (vars.playerType === 'spectate') {
    sendUint8(1);
  } else {
    msg = prepareData(1 + 2 * vars.playerName.length);
    msg.setUint8(0, 0);
    for (let i = 0; i < vars.playerName.length; ++i) {
      msg.setUint16(1 + 2 * i, vars.playerName.charCodeAt(i), true);
    }
    wsSend(msg);
  }
  vars.disconnected = false;
  console.info('Connection successful!');
}

function onWsClose() {
  vars.disconnected = true;
  //console.log('Closed!!!');
}

function onWsMessage(msg) {
  handleWsMessage(new DataView(msg.data));
  getObjects();
}

function getObjects(...args) {
  let playerData = {};
  for (let i = 0; i < userData.length; i++) {
    if (typeof(userData[i].id) === 'undefined') {
      playerData = userData[i];
      i = userData.length;
    }
  }

  /**
   * playerData just a diff data,
   * so we just update and change data
   */
  playerData.x = ('x' in playerData ? playerData.x : player._x) || 0;
  playerData.y = ('y' in playerData ? playerData.y : player._y) || 0;

  const xOffset = player.x - playerData.x;
  const yOffset = player.y - playerData.y;


  //if (vars.playerType === 'player') {
  //  'hue' in playerData && (player.hue = playerData.hue);
  //  'massTotal' in playerData && (player.massTotal = playerData.massTotal);
  //  'bonus' in playerData && (player.bonus = playerData.bonus);
  //  'sprite' in playerData && (player.sprite = playerData.sprite);
  // // debugger;
  //}

  player.x = playerData.x;
  player.y = playerData.y;
  player.xoffset = isNaN(xOffset) ? 0 : xOffset;
  player.yoffset = isNaN(yOffset) ? 0 : yOffset;

  if ('type' in playerData) {
    console.log(playerData);
    player.type = playerData.type;
  }

  objs.users = CacheDatas(userData, objs.usersIndex, userCellSprites);
  objs.viruses = CacheDatas(virusList, objs.virusesIndex, virusesSprites);
  objs.glue = CacheDatas(glueList, objs.glueIndex, glueSprites);
  objs.bomb = CacheDatas(bombList, objs.bombIndex, bombSprites);
  objs.drunk = CacheDatas(drunkList, objs.drunkIndex, drunkSprites);
  objs.shoot = CacheDatas(shootList, objs.shootIndex, shootSprites);
  objs.x2 = CacheDatas(x2List, objs.x2Index, x2Sprites);
  objs.x5 = CacheDatas(x5List, objs.x5Index, x5Sprites);
  objs.extra1 = CacheDatas(extra1List, objs.extra1Index, extra1Sprites);
  objs.extra2 = CacheDatas(extra2List, objs.extra2Index, extra2Sprites);
  objs.extra3 = CacheDatas(extra3List, objs.extra3Index, extra3Sprites);
  objs.extra4 = CacheDatas(extra4List, objs.extra4Index, extra4Sprites);
  objs.extra5 = CacheDatas(extra5List, objs.extra5Index, extra5Sprites);
  objs.freeze = CacheDatas(freezeList, objs.freezeIndex, freezeSprites);
  objs.speed = CacheDatas(speedList, objs.speedIndex, speedSprites);
  objs.fireFood = CacheDatas(massList, objs.fireFoodIndex, foodsSprites);
  objs.foods = CacheDatas(foodsList, objs.foodsIndex, foodsSprites);
  objs.shield = CacheDatas(shieldList, objs.shieldIndex, shieldSprite);
  objs.mega = CacheDatas(megaList, objs.megaIndex, megaSprites);
  // cacheData(bullet, bulletList, bulletIndex, foodsSprites);
}


function getSvg(image, offset) {
  return `<li class="containerSVG" style="background-image: url(${image})">
            <svg class="svgCircle" width="70" height="70" viewPort="0 0 70 70" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <circle r="31" cx="35" cy="35" fill="transparent" stroke-dasharray="200" stroke-dashoffset="0"></circle>
              <circle class="svgCircleBar" r="31" cx="35" cy="35" fill="transparent" stroke-dasharray="200" stroke-dashoffset="0" style="stroke-dashoffset: ${offset * 2}px;"></circle>
            </svg>
          </li>`;
}

function drawBonuses(bonuses) {
  let strRight = '<ul>';
  let strBottom = '<ul>';
  if (bonuses.glue.active) {
    strRight += getSvg(glueImage, bonuses.glue.progress);
  }
  if (bonuses.bomb.active) {
    strRight += getSvg(bombImage, bonuses.bomb.progress);
  }
  if (bonuses.drunk.active) {
    strRight += getSvg(drunkImage, bonuses.drunk.progress);
  }
  if (bonuses.shoot.active) {
    strRight += getSvg(shootImage, bonuses.shoot.progress);
  }
  if (bonuses.freeze.active) {
    strRight += getSvg(freezeImage, bonuses.freeze.progress);
  }
  if (bonuses.speed.active) {
    strRight += getSvg(speedImage, bonuses.speed.progress);
  }
  if (bonuses.shield.active) {
    strRight += getSvg(shieldImage, bonuses.shield.progress);
  }
  if (bonuses.extra['1']) {
    strBottom += `<li><img src="${extra1Image}"></li>`;
  }
  if (bonuses.extra['2']) {
    strBottom += `<li><img src="${extra2Image}"></li>`;
  }
  if (bonuses.extra['3']) {
    strBottom += `<li><img src="${extra3Image}"></li>`;
  }
  if (bonuses.extra['4']) {
    strBottom += `<li><img src="${extra4Image}"></li>`;
  }
  if (bonuses.extra['5']) {
    strBottom += `<li><img src="${extra5Image}"></li>`;
  }
  strRight += '</ul>';
  strBottom += '</ul>';
  rightBonuses.empty().append(strRight);
  bottomBonuses.empty().append(strBottom);
}

export default () => {
  player.name = vars.playerName;
  player.w = window.innerWidth;
  player.h = window.innerHeight;
  player.sprite = randomProperty(sprites);
  // player.target = target;
  //player.score = 0;
  player.type = vars.playerType;
  vars.gameStart = true;
  document.body.id = 'gameStarted';
  vars.socket.onopen = onWsOpen;
  vars.socket.onmessage = onWsMessage;
  vars.socket.onclose = onWsClose;
  renderer.zoom = 1;
  renderer.scale = 1;
  if (vars.playerType === 'spectate'){
    renderer.zoom = 0.2;
  }
  else { renderer.zoom = 1;
 }


  window.addEventListener('wheel', onZoom);
  window.addEventListener('mousemove', function(event) {
    vars.rawMouseX = event.clientX;
    vars.rawMouseY = event.clientY;
    mouseCoordinateChange();
  });
  document.getElementById('cvs').onfocus = function() {
    vars.isTyping = false;
  };

  document.getElementById('chat_textbox').onblur = function() {
    vars.isTyping = false;
  };


  document.getElementById('chat_textbox').onfocus = function() {
    vars.isTyping = true;
  };

  let spacePressed, qPressed, ePressed, rPressed, tPressed, pPressed, wPressed;
  spacePressed = false;
  qPressed = false;
  ePressed = false;
  rPressed = false;
  tPressed = false;
  pPressed = false;
  wPressed = false;
  window.onkeydown = function(event) {
    switch (event.keyCode) {
      case 13: // enter
          vars.isTyping = false;
          document.getElementById('chat_textbox').blur();
          let chattxt = document.getElementById('chat_textbox').value;
          if (chattxt.length > 0) sendChat(chattxt);
          document.getElementById('chat_textbox').value = '';
        break;
      case 32: // space
        if ((!spacePressed) && (!vars.isTyping)) {
          sendMouseMove();
          sendUint8(17);
          spacePressed = true;
        }
        break;
      case 87: // W
        if ((!wPressed) && (!vars.isTyping)) {
          sendMouseMove();
          sendUint8(21);
          wPressed = true;
        }
        break;
      case 81: // Q
        if ((!qPressed) && (!vars.isTyping)) {
          sendUint8(18);
          qPressed = true;
        }
        break;
      case 69: // E
        if (!ePressed && (!vars.isTyping)) {
          sendMouseMove();
          sendUint8(22);
        }
        break;
      case 82: // R
        if (!rPressed && (!vars.isTyping)) {
          sendMouseMove();
          sendUint8(23);
        }
        break;
      case 84: // T
        if (!tPressed && (!vars.isTyping)) {
          sendMouseMove();
          sendUint8(24);
          tPressed = true;
        }
        break;
      case 80: // P
        if (!pPressed && (!vars.isTyping)) {
          sendMouseMove();
          sendUint8(25);
          pPressed = true;
        }
        break;
      case 27: // esc
        if (vars.playerType === 'spectate') {
          toggleGameMenu(true);
        }
        if (vars.playerType === 'player') {
          vars.playerType = 'spectate';
          startGame('spectate');
          toggleGameMenu(true);

        }

        // showOverlays(true);
        break;
    }
  };
  window.onkeyup = function(event) {
    switch (event.keyCode) {
      case 32: // space
        spacePressed = false;
        break;
      case 87: // W
        wPressed = false;
        break;
      case 81: // Q
        if (qPressed) {
          sendUint8(19);
          qPressed = false;
        }
        break;
      case 69:
        ePressed = false;
        break;
      case 82:
        rPressed = false;
        break;
      case 84:
        tPressed = false;
        break;
      case 80:
        pPressed = false;
        break;
    }
  };
  window.onblur = function() {
    sendUint8(19);
    wPressed = spacePressed = qPressed = ePressed = rPressed = tPressed = pPressed = false
  };
  setInterval(sendMouseMove, 40);
  setInterval(() => {
    miniMap();
  }, 150);
  setInterval(drawChatBoard, 1E3);
  setInterval(() => {
    coordinatesId.innerHTML = `x: ${Math.round(player.x)} y: ${Math.round(player.y)}`;
  }, 500);

  setInterval(() => {
    let totalM = 0;
    let scale = 0.2;
    if (objs.playerCells.length > 0 && objs.nodes[objs.playerCells[0].id]) {
     totalM = objs.nodes[objs.playerCells[0].id].massTotal;
     scale = Math.sqrt(totalM * 100);
     //console.log(Math.pow(Math.min(64 / scale, 1), 0.4));
     scale = Math.pow(Math.min(64 / scale, 1), 0.4);
     renderer.zoom =scale;
     GAMESTAT.addData(totalM);
      }
  }, 500);

  setInterval(() => {
    if (objs.playerCells.length > 0) {
      drawBonuses(objs.playerCells[0].bonuses);
    }
  }, 500);

};
