// Import
const BinaryWriter = require('./BinaryWriter');

function MiniMap(playerTracker, players) {
  this.playerTracker = playerTracker;
  this.otherPlayers = players;
}

module.exports = MiniMap;

MiniMap.prototype.build = function() {
  const writer = new BinaryWriter();
  const blobs = [];
  for (let i = 0; i < this.otherPlayers.length; i++) {
    const player = this.otherPlayers[i].playerTracker;
    if (player.isRemoved || !player.cells.length ||
        player.socket.isConnected == false) {
      continue;
    }

    for (let j = 0; j < player.cells.length; j++) {
      const cell = player.cells[j];
      if (cell.cellType === 0) {
        blobs.push({
          x: Math.round(cell.position.x),
          y: Math.round(cell.position.y)
        });
      }
    }
  }
  writer.writeUInt8(0x58);
  writer.writeUInt32(blobs.length >>> 0);
  for (let i = 0; i < blobs.length; i++) {
    writer.writeFloat(blobs[i].x);
    writer.writeFloat(blobs[i].y);
  }
  return writer.toBuffer();
};
