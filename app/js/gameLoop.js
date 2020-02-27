import vars from './variables';

import {
  graph,
  renderer
} from './dom';

import {
  player,
  playerConfig
} from './player';

import {
  drawFood,
  drawVirus,
  drawBots,
  drawFireFood,
  drawFire,
  drawPlayers,
  drawborder,
  drawBonus,
  //drawgrid
} from './draw';

import {
  objs
} from './objects';

// import target from './target';

var cvs = document.getElementById('cvs');

function resizeCanvas() {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  // Wrapper approach
 // renderer.resizeMe(cvs.width, cvs.height);
  // Direct approach
  renderer.renderer.resize(cvs.width, cvs.height);
}

window.addEventListener('resize', resizeCanvas);

export default () => {
  const scale = window.innerHeight / window.innerHeight;
  graph.clear();
  const textStyle = {
    // font: '30px bold sans-serif',
  fontFamily : 'Ubuntu',
	fontSize : '30px',
	fontWeight : 'bold',
	fill: playerConfig.textColor,
    stroke: playerConfig.textBorder,
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  if (!vars.disconnected) {
    // graph.beginFill(0xffffff);
    // graph.lineStyle(5,0xffffff);
    // graph.drawRect(0, 0, screenWidth, screenHeight);
    // graph.endFill();
    // drawgrid();


    if (vars.gameStart) {
       renderer.setText(vars.died ? 'You died!' : '', 'state', textStyle);
      renderer.ground.tilePosition.set(
        -player.x * scale,
        -player.y * scale
      );

	  var i = objs.foods.length;
	  for (i = 0; i < objs.foods.length; i++) {
      drawFood(objs.foods[i]);
    }
    var i = objs.glue.length;
    for (i = 0; i < objs.glue.length; i++) {
        drawBonus(objs.glue[i], 'glue');
      }
      var i = objs.shield.length;
    for (i = 0; i < objs.shield.length; i++) {
        drawBonus(objs.shield[i], 'shield');
      }
      var i = objs.bomb.length;
    for (i = 0; i < objs.bomb.length; i++) {
        drawBonus(objs.bomb[i], 'bomb');
      }
      var i = objs.drunk.length;
    for (i = 0; i < objs.drunk.length; i++) {
        drawBonus(objs.drunk[i], 'drunk');
      }
      var i = objs.mega.length
    for (i = 0; i < objs.mega.length; i++) {
        drawBonus(objs.mega[i], 'mega');
      }
      var i = objs.shoot.length;
    for (i = 0; i < objs.shoot.length; i++) {
        drawBonus(objs.shoot[i], 'shoot');
      }
      var i = objs.x2.length;
    for (i = 0; i < objs.x2.length; i++) {
        drawBonus(objs.x2[i], 'x2');
      }
      var i = objs.x5.length;
    for (i = 0; i < objs.x5.length; i++) {
        drawBonus(objs.x5[i], 'x5');
      }
      var i = objs.extra1.length;
    for (i = 0; i < objs.extra1.length; i++) {
        drawBonus(objs.extra1[i], 'extra1');
      }
      var i = objs.extra2.length;
    for (i = 0; i < objs.extra2.length; i++) {
        drawBonus(objs.extra2[i], 'extra2');
      }
      var i = objs.extra3.length;
    for (i = 0; i < objs.extra3.length; i++) {
        drawBonus(objs.extra3[i], 'extra3');
    }
      var i = objs.extra4.length;
    for (i = 0; i < objs.extra4.length; i++) {
        drawBonus(objs.extra4[i], 'extra4');
      }
      var i = objs.extra5.length;
    for (i = 0; i < objs.extra5.length; i++) {
        drawBonus(objs.extra5[i], 'extra5');
      }
      var i = objs.freeze.length;
    for (i = 0; i < objs.freeze.length; i++) {
        drawBonus(objs.freeze[i], 'freeze');
      }
      var i = objs.speed.length;
    for (i = 0; i < objs.speed.length; i++) {
        drawBonus(objs.speed[i], 'speed');
      }
      var i = objs.fireFood.length;
    for (i = 0; i < objs.fireFood.length; i++) {
        drawFireFood(objs.fireFood[i]);
      }
      var i = objs.bullet.length;
    for (i = 0; i < objs.bullet.length; i++) {
        drawFire(objs.bullet[i]);
      }
      var i = objs.viruses.length;
    for (i = 0; i < objs.viruses.length; i++) {
        drawVirus(objs.viruses[i]);
      }

  //    if (vars.borderDraw) {
  //      drawborder();
  //    }

      const orderMass = [];
      // console.log(`Users: ${objs.users.length}`);
	  var i = objs.users.length;
    for (i = 0; i < objs.users.length; i++) {
      // for (let i = 0; i < objs.users.length; i++) {
        if (objs.users[i].type === 'player') {
          orderMass.push(i);
        }
      }

      if (objs.playerCells.length > 0) {
        // calcViewZoom();
        let c = 0;
        let a = 0;
        for (let i = 0; i < objs.playerCells.length; i++) {
          // playerCells[i].updatePos();
          a += objs.playerCells[i].x / objs.playerCells.length;
          c += objs.playerCells[i].y / objs.playerCells.length;
        }
        // vars.posX = a;
        // vars.posY = c;
        // vars.posSize = vars.viewZoom;
        vars.nodeX = (vars.nodeX + a) / 2;
        vars.nodeY = (vars.nodeY + c) / 2;
      } else {
        // vars.nodeX = (29 * vars.nodeX + vars.posX) / 30;
        // vars.nodeY = (29 * vars.nodeY + vars.posY) / 30;
        // vars.viewZoom = (9 * vars.viewZoom + vars.posSize * viewRange()) / 10;
      }
      drawPlayers(orderMass);
    }

    if (vars.died) {
     // renderer.setText('Game Over!', 'state', textStyle);
    }
  } else {
    graph.beginFill(0x171717);
    graph.lineStyle(0);
    graph.drawRect(0, 0, window.innerWidth, window.innerHeight);
    graph.endFill();
    //console.log(vars.disconnected);
    if (vars.kicked) {
      if (vars.reason !== '') {
        renderer.setText(`You were kicked for:\r\n${vars.reason}`, 'state', textStyle);
      } else {
        renderer.setText('You were kicked!', 'state', textStyle);
      }
    } else {
      // renderer.setText('Disconnected!', 'state', textStyle);
    }
  }
  renderer && renderer.render();
};
