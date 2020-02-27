var Vec2 = require('../modules/Vec2');

function Cell(gameServer, owner, position, size, bonus) {
  this.gameServer = gameServer;
  this.owner = owner;     // playerTracker that owns this cell

  this.color = { r: 0, g: 0, b: 0 };
  this.radius = 0;
  this._size = 0;
  this._mass = 0;
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
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
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
  this.cellType = -1;
  // 0 = Player Cell
  // 1 = Food
  // 2 = Virus
  // 3 = Ejected Mass
  // 4 = Bonus
  // 5 = Bullet
  // 6 = Bomb
  this.bonusType = -1;
  // 1 - glue
  // 2 - bomb
  // 3 - drunk
  // 4 - shoot
  // 5 - x2
  // 6 - x5
  // 7 - extra1
  // 8 - extra2
  // 9 - extra3
  // 10 - extra4
  // 11 - extra5
  // 12 - freeze
  // 13 - speed
  // 14 - shield
  // 15 - mega
  this.isSpiked = false;  // If true, then this cell has spikes around it
  this.isAgitated = false;// If true, then this cell has waves on it's outline
  this.killedBy = null;   // Cell that ate this cell
  this.isMoving = false;  // Indicate that cell is in boosted mode
  this.boostDistance = 0;
  this.boostDirection = new Vec2(1, 0);

  if (this.gameServer) {
    this.tickOfBirth = this.gameServer.tickCounter;
    this.nodeId = this.gameServer.lastNodeId++ >> 0;
    if (size) this.setSize(size);
    if (position) this.position = new Vec2(position.x, position.y);
    if (bonus) this.bonusType = bonus;
  }
}

module.exports = Cell;

// Fields not defined by the constructor are considered private and need a getter/setter to access from a different class

Cell.prototype.setSize = function (size) {
  this._size = size;
  this.radius = size * size;
  this._mass = this.radius / 100;
};

// by default cell cannot eat anyone
Cell.prototype.canEat = function (cell) {
  return false;
};

// Returns cell age in ticks for specified game tick
Cell.prototype.getAge = function () {
  return this.gameServer.tickCounter - this.tickOfBirth;
};

// Called to eat prey cell
Cell.prototype.onEat = function (prey) {
  if (!this.gameServer.config.playerBotGrow) {
    if (this._size >= 250 && prey._size <= 41 && prey.cellType == 0)
      prey.radius = 0; // Can't grow from players under 17 mass
  }
  this.setSize(Math.sqrt(this.radius + prey.radius));
};

Cell.prototype.setBoost = function (distance, angle) {
  this.boostDistance = distance;
  this.boostDirection = new Vec2(
    Math.sin(angle),
    Math.cos(angle)
  );
  this.isMoving = true;
  if (!this.owner) {
    var index = this.gameServer.movingNodes.indexOf(this);
    if (index < 0) this.gameServer.movingNodes.push(this);
  }
};

Cell.prototype.checkBorder = function (b) {
  var r = this._size / 2;
  if (this.position.x < b.minx + r || this.position.x > b.maxx - r) {
    this.boostDirection.scale(-1, 1); // reflect left-right
    this.position.x = Math.max(this.position.x, b.minx + r);
    this.position.x = Math.min(this.position.x, b.maxx - r);
  }
  if (this.position.y < b.miny + r || this.position.y > b.maxy - r) {
    this.boostDirection.scale(1, -1); // reflect up-down
    this.position.y = Math.max(this.position.y, b.miny + r);
    this.position.y = Math.min(this.position.y, b.maxy - r);
  }
};

function getProgress(bonus, delta) {
  const remain = Math.round(100 / ((bonus * 1000) / delta));
  return remain;
}

Cell.prototype.checkBonuses = function () {
  if (!this.owner) return; // Only players
  if (this.bonuses.glue.date) {
    const delta = Date.now() - (this.bonuses.glue.date);
    if (delta > (this.gameServer.config.bonusGlueTime * 1000)) {
      this.bonuses.glue.active = false;
      delete this.bonuses.glue.date;
    } else {
      this.bonuses.glue.progress = getProgress(this.gameServer.config.bonusGlueTime, delta);
    }
  }
  if (this.bonuses.bomb.date) {
    const delta = Date.now() - (this.bonuses.bomb.date);
    if (delta > (this.gameServer.config.bonusBombTime * 1000)) {
      this.bonuses.bomb.active = false;
      delete this.bonuses.bomb.date;
    } else {
      this.bonuses.bomb.progress = getProgress(this.gameServer.config.bonusBombTime, delta);
    }
  }
  if (this.bonuses.drunk.date) {
    const delta = Date.now() - (this.bonuses.drunk.date);
    if (delta > (this.gameServer.config.bonusDrunkTime * 1000)) {
      this.bonuses.drunk.active = false;
      delete this.bonuses.drunk.date;
    } else {
      this.bonuses.drunk.progress = getProgress(this.gameServer.config.bonusDrunkTime, delta);
    }
  }
  if (this.bonuses.shoot.date) {
    const delta = Date.now() - (this.bonuses.shoot.date);
    if (delta > (this.gameServer.config.bonusShootTime * 1000)) {
      this.bonuses.shoot.active = false;
      delete this.bonuses.shoot.date;
    } else {
      this.bonuses.shoot.progress = getProgress(this.gameServer.config.bonusShootTime, delta);
    }
  }
  if (this.bonuses.freeze.date) {
    const delta = Date.now() - (this.bonuses.freeze.date);
    if (delta > (this.gameServer.config.bonusFreezeTime * 1000)) {
      this.bonuses.freeze.active = false;
      delete this.bonuses.freeze.date;
    } else {
      this.bonuses.freeze.progress = getProgress(this.gameServer.config.bonusFreezeTime, delta);
    }
  }
  if (this.bonuses.speed.date) {
    const delta = Date.now() - (this.bonuses.speed.date);
    if (delta > (this.gameServer.config.bonusSpeedTime * 1000)) {
      this.bonuses.speed.active = false;
      delete this.bonuses.speed.date;
    } else {
      this.bonuses.speed.progress = getProgress(this.gameServer.config.bonusSpeedTime, delta);
    }
  }
  if (this.bonuses.shield.date) {
    const delta = Date.now() - (this.bonuses.shield.date);
    if (delta > (this.gameServer.config.bonusShieldTime * 1000)) {
      this.bonuses.shield.active = false;
      delete this.bonuses.shield.date;
    } else {
      this.bonuses.shield.progress = getProgress(this.gameServer.config.bonusShieldTime, delta);
    }
  }
};

Cell.prototype.onEaten = function (hunter) { };
Cell.prototype.onAdd = function (gameServer) { };
Cell.prototype.onRemove = function (gameServer) { };
