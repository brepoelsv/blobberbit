import Config from '../../config.json';
import sprites from '../js/sprites.js';
import {
  hslToRgb
} from './utilities.js';

import vars, {
  off
} from './variables';

import {
  player,
  playerConfig
} from './player';

import {
  objs
} from './objects';

import {
  valueInRange,
  upLetter,
  log,
  randomProperty
} from '../../server/lib/util.js';

import {
  renderer,
  graph
} from './dom.js'




export function sizeToMass (size) {
  return Number((size * size) / 100).toFixed();
}


function drawName(name, cell) {
  const fontSize = Math.max(cell.radius / 3 | 0, 20) | 0;
  const textStyle = {
    fontFamily : 'Ubuntu',
    fontSize : `${fontSize}px`,
    fontWeight : 'bold',
    fill: '#ffffff',
    stroke: '#888888'
  };
  cell.setText(!Config.toggleShowNameState ? name : '', 'name', textStyle);

  const massString = !Config.toggleMassState ? Math.round(sizeToMass(cell.radius) | 0) + '' : '';
  cell.setText(massString, 'mass', {
    ...textStyle,
    fontFamily : 'Ubuntu',
    fontSize : (Math.max(cell.radius / 3 | 0, 20) | 0)+"px",  //fontSize : `${fontSize}px`,   gives error in debugger JS
    fontWeight : 'bold',
    fill: '#ffffff',
    stroke: '#888888',
    y: fontSize
   });
}

export function drawFood(food) {
  const [r, g, b] = hslToRgb(food.hue / 360, 1, 0.5);
  food.loop();
  food._spriteImage.tint = (r << 16) | (g << 8) | (b);
  food.render(food.x - player.x + window.innerWidth / 2, food.y - player.y + window.innerHeight / 2, food.radius * 3, vars.foodSides * 3);
}

export function drawVirus(virus) {
  virus.loop();
  virus.render(virus.x - player.x + window.innerWidth / 2, virus.y - player.y + window.innerHeight / 2, virus.radius * 2, virus.radius * 2);
}

export function drawFireFood(mass) {
  const [r, g, b] = hslToRgb(mass.hue / 360, 1, 0.5);
  mass.loop();
  mass._spriteImage.tint = (r << 16) | (g << 8) | (b);
  mass.render(mass.x - player.x + window.innerWidth / 2, mass.y - player.y + window.innerHeight / 2, mass.radius - 5, 18 + (~~(mass.masa / 5)));
}

export function drawFire(bull) {
  const [r, g, b] = hslToRgb(bull.hue / 360, 1, 0.5);
  bull.loop();
  bull._spriteImage.tint = (r << 16) | (g << 8) | (b);
  bull.render(bull.x - player.x + window.innerWidth / 2, bull.y - player.y + window.innerHeight / 2, bull.radius - 5, 18 + (~~(bull.masa / 5)));
}


let levelPlayer = 1;


export function drawPlayers(order) {

  player.loop();

  const start = {
    x: player.x - (window.innerWidth / 2),
    y: player.y - (window.innerHeight / 2)
  };


  let z;
  let length = order.length;
  for (z = 0; z < length; z++) {
    const userCurrent = objs.users[z];
    const [r, g, b] = hslToRgb(userCurrent.hue / 360, 1, 0.5);
    // const cellCurrent = objs.users[order[z].nCell].cells[order[z].nDiv];
    userCurrent.loop();
    //debugger;
    if (userCurrent.sprite === "") {userCurrent.sprite = player.sprite};
    const circle = {
      x: userCurrent.x - start.x,
      y: userCurrent.y - start.y
    };

    let level = 1;
    if ((userCurrent.massTotal > Config.skinLevels.level1) &&
        (userCurrent.massTotal < Config.skinLevels.level2)) {
      level = 2;
    } else if ((userCurrent.massTotal >= Config.skinLevels.level2) &&
               (userCurrent.massTotal < Config.skinLevels.level3)) {
      level = 3;
    } else if ( userCurrent.massTotal >= Config.skinLevels.level3 ) {
      level = 4;
    }

    let spriteSrc = userCurrent.avatar ||
            (userCurrent.sprite &&
             (Config.url + sprites[userCurrent.sprite].sprites[level]))
    if(userCurrent.sprite === 'default') {
      userCurrent._spriteImage.tint = (r << 16) | (g << 8) | (b);
     }
    else {
      userCurrent._spriteImage.tint = 0xffffff;
     }

    if (userCurrent._avatar !== userCurrent.avatar) {
      userCurrent.setMask(userCurrent.avatar ? ('/app/img/defaultblob.png') : '' );
      userCurrent._avatar = userCurrent.avatar;
    }

    userCurrent.setSrc(spriteSrc);
    userCurrent.render(circle.x, circle.y, userCurrent.radius * 2, userCurrent.radius * 2);


    let nameCell = '';
    if (typeof(userCurrent.id) === 'undefined') {
      nameCell = player.name;
    } else {
      nameCell = userCurrent.name;
    }
    drawName(nameCell, userCurrent);

    if (userCurrent.bonuses.freeze.active) {
      drawBonusCircle(userCurrent, circle, log(Config.bonus.Freeze.radius, 50));
    }
    if (userCurrent.bonuses.drunk.active) {
      drawBonusCircle(userCurrent, circle, log(Config.bonus.Drunk.radius, 50));
    }
    if (userCurrent.bonuses.glue.active) {
      drawBonusCircle(userCurrent, circle, log(Config.bonus.Glue.radius, 50));
    }
    if (userCurrent.bonuses.shoot.active) {
      drawBonusCircle(userCurrent, circle, log(Config.bonus.Shoot.radius, 50));
    }
  }
}

//export function drawborder() {
//  const scale = window.innerHeight / window.innerHeight;
//
//  const top = window.innerHeight / 2 - player.y;
//  const bottom = window.innerHeight + top;
//  const left = window.innerWidth / 2 - player.x;
//  const right = window.innerWidth + left;
//
//  const zoom = 2 / renderer.zoom;
//
//  const screenTop = window.innerHeight * 0.5 - window.innerHeight * 0.5 * zoom;
//  const screenBottom = window.innerHeight * 0.5 + window.innerHeight * 0.5 * zoom;
//  const screenLeft = window.innerWidth * 0.5 - window.innerWidth * 0.5 * zoom;
//  const screenRight = window.innerWidth * 0.5 + window.innerWidth * 0.5 * zoom;
//
//  graph.lineStyle(Math.ceil(zoom), playerConfig.borderColor);
//
//  // Left-horizontal.
//  if (left > screenTop) {
//    graph.moveTo(left * scale, Math.max(screenTop, top) * scale);
//    graph.lineTo(left * scale, Math.min(bottom, screenBottom) * scale);
//  }
//
//  // Top-horizontal.
//  if (top > screenTop) {
//    graph.moveTo( Math.max(screenLeft, left) * scale, top * scale);
//    graph.lineTo( Math.min(right, screenRight) * scale, top * scale);
//  }
//
//  // Right-vertical.
//  if (right < screenRight) {
//    graph.moveTo(right * scale, Math.max(screenTop, top) * scale);
//    graph.lineTo(right * scale, Math.min(bottom, screenBottom) * scale);
//  }
//
//  // Bottom-horizontal.
//  if (bottom < screenBottom) {
//    graph.moveTo(Math.max(screenLeft, left) * scale, bottom * scale);
//    graph.lineTo(Math.min(right, screenRight) * scale, bottom * scale);
//  }
//}

function drawBonusCircle(cellCurrent, userCurrent, circle, radius) {
  if (cellCurrent.biggest) {
    const r =  (cellCurrent.radius * radius);
    const scale = window.innerWidth / window.innerWidth;
    const points = 15 + r * 0.05;
    const increase = Math.PI * 2 / points;
    let x = 0;
    let y = 0;
    let spin = -Math.PI;
    const listPoints = [];
    for (let i = 0; i < points; i++) {
      x = r * Math.cos(spin) + circle.x;
      y = r * Math.sin(spin) + circle.y;
      if (typeof(userCurrent.id) === 'undefined') {
        x = valueInRange(-userCurrent.x + window.innerWidth / 2, window.innerWidth - userCurrent.x + window.innerWidth / 2, x);
        y = valueInRange(-userCurrent.y + window.innerHeight / 2, window.innerHeight - userCurrent.y + window.innerHeight / 2, y);
      } else {
        x = valueInRange(-cellCurrent.x - player.x + window.innerWidth / 2 + (cellCurrent.radius / 3), window.innerWidth - cellCurrent.x + window.innerWidth - player.x + window.innerWidth / 2 - (cellCurrent.radius / 3), x);
        y = valueInRange(-cellCurrent.y - player.y + window.innerHeight / 2 + (cellCurrent.radius / 3), window.innerHeight - cellCurrent.y + window.innerHeight - player.y + window.innerHeight / 2 - (cellCurrent.radius / 3), y);
      }
      spin += increase;
      listPoints.push(x * scale);
      listPoints.push(y * scale);
    }

    // graph.lineStyle(1, hslToRgb(userCurrent.hue, 1, 0.45));
    graph.beginFill(0x000000, 0.25);
    graph.drawPolygon(listPoints);
  }
}

export function drawBonus(bonus, name) {
  const nm = upLetter(name);
  bonus.loop();
  bonus.render(bonus.x - player.x + window.innerWidth / 2, bonus.y - player.y + window.innerHeight / 2, Config.bonus[nm].image.w, Config.bonus[nm].image.h);
}
