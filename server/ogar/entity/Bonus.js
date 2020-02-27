var Cell = require('./Cell');

function Bonus() {
  Cell.apply(this, Array.prototype.slice.call(arguments));
  this.cellType = 4;
  this.isSpiked = false;
  this.isMotherCell = false; // Not to confuse bots
}

module.exports = Bonus;
Bonus.prototype = new Cell();

// Main Functions

Bonus.prototype.canEat = function () {
  return false;
};

Bonus.prototype.onEat = function () {
  return false;
};

Bonus.prototype.onEaten = function (c) {
  if (!c.owner) return; // Only players
  switch (this.bonusType) {
    case 1:
      // glue
      c.bonuses.glue.active = true;
      c.bonuses.glue.date = Date.now();
      break;
    case 2:
      // bomb
      break;
    case 3:
      // drunk
      c.bonuses.drunk.active = true;
      c.bonuses.drunk.date = Date.now();
      break;
    case 4:
      // shoot
      c.bonuses.shoot.active = true;
      c.bonuses.shoot.date = Date.now();
      break;
    case 5:
      // x2
      c.setSize(c._size * 2);
      break;
    case 6:
      // x5
      c.setSize(c._size * 5);
      break;
    case 7:
      // extra1
      c.bonuses.extra['1'] = true;
      this.checkExtra(c);
      break;
    case 8:
      // extra2
      c.bonuses.extra['2'] = true;
      this.checkExtra(c);
      break;
    case 9:
      // extra3
      c.bonuses.extra['3'] = true;
      this.checkExtra(c);
      break;
    case 10:
      // extra4
      c.bonuses.extra['4'] = true;
      this.checkExtra(c);
      break;
    case 11:
      // extra5
      c.bonuses.extra['5'] = true;
      this.checkExtra(c);
      break;
    case 12:
      // freeze
      c.bonuses.freeze.active = true;
      c.bonuses.freeze.date = Date.now();
      break;
    case 13:
      // speed
      c.bonuses.speed.active = true;
      c.bonuses.speed.date = Date.now();
      break;
    case 14:
      // shield
      c.bonuses.shield.active = true;
      c.bonuses.shield.date = Date.now();
      break;
    case 15:
      // mega
      break;
  }
};

Bonus.prototype.onAdd = function (gameServer) {
  switch (this.bonusType) {
    case 1:
      gameServer.nodesBonusGlue.push(this);
      break;
    case 2:
      gameServer.nodesBonusBomb.push(this);
      break;
    case 3:
      gameServer.nodesBonusDrunk.push(this);
      break;
    case 4:
      gameServer.nodesBonusShoot.push(this);
      break;
    case 5:
      gameServer.nodesBonusX2.push(this);
      break;
    case 6:
      gameServer.nodesBonusX5.push(this);
      break;
    case 7:
      gameServer.nodesBonusExtra1.push(this);
      break;
    case 8:
      gameServer.nodesBonusExtra2.push(this);
      break;
    case 9:
      gameServer.nodesBonusExtra3.push(this);
      break;
    case 10:
      gameServer.nodesBonusExtra4.push(this);
      break;
    case 11:
      gameServer.nodesBonusExtra5.push(this);
      break;
    case 12:
      gameServer.nodesBonusFreeze.push(this);
      break;
    case 13:
      gameServer.nodesBonusSpeed.push(this);
      break;
    case 14:
      gameServer.nodesBonusShield.push(this);
      break;
    case 15:
      gameServer.nodesBonusMega.push(this);
      break;
  }
};

Bonus.prototype.onRemove = function (gameServer) {
  let index;
  switch (this.bonusType) {
    case 1:
      index = gameServer.nodesBonusGlue.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusGlue.splice(index, 1);
      }
      break;
    case 2:
      index = gameServer.nodesBonusBomb.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusBomb.splice(index, 1);
      }
      break;
    case 3:
      index = gameServer.nodesBonusDrunk.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusDrunk.splice(index, 1);
      }
      break;
    case 4:
      index = gameServer.nodesBonusShoot.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusShoot.splice(index, 1);
      }
      break;
    case 5:
      index = gameServer.nodesBonusX2.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusX2.splice(index, 1);
      }
      break;
    case 6:
      index = gameServer.nodesBonusX5.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusX5.splice(index, 1);
      }
      break;
    case 7:
      index = gameServer.nodesBonusExtra1.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusExtra1.splice(index, 1);
      }
      break;
    case 8:
      index = gameServer.nodesBonusExtra2.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusExtra2.splice(index, 1);
      }
      break;
    case 9:
      index = gameServer.nodesBonusExtra3.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusExtra3.splice(index, 1);
      }
      break;
    case 10:
      index = gameServer.nodesBonusExtra4.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusExtra4.splice(index, 1);
      }
      break;
    case 11:
      index = gameServer.nodesBonusExtra5.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusExtra5.splice(index, 1);
      }
      break;
    case 12:
      index = gameServer.nodesBonusFreeze.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusFreeze.splice(index, 1);
      }
      break;
    case 13:
      index = gameServer.nodesBonusSpeed.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusSpeed.splice(index, 1);
      }
      break;
    case 14:
      index = gameServer.nodesBonusShield.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusShield.splice(index, 1);
      }
      break;
    case 15:
      index = gameServer.nodesBonusMega.indexOf(this);
      if (index != -1) {
        gameServer.nodesBonusMega.splice(index, 1);
      }
      break;
  }
};

Bonus.prototype.checkExtra = function (player) {
  if (player.bonuses.extra['1'] &&
      player.bonuses.extra['2'] &&
      player.bonuses.extra['3'] &&
      player.bonuses.extra['4'] &&
      player.bonuses.extra['5']) {
    player.bonuses.extra = {
      time: Date.now(),
      active: true
    };
    player.bonuses.extra['1'] = false;
    player.bonuses.extra['2'] = false;
    player.bonuses.extra['3'] = false;
    player.bonuses.extra['4'] = false;
    player.bonuses.extra['5'] = false;
    if (player.nodeId !== this.gameServer.leaderboard[0].pID) {
      let size = 0;
      for (let i = 0; i < this.gameServer.leaderboard[0].cells.length; i++) {
        size += this.gameServer.leaderboard[0].cells[i]._size;
      }
      player.setSize(size + 1);
    }
  }
};
