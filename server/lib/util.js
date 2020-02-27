import Config from '../../config.json';

const randomInRange = (from, to) => {
  return Math.floor(Math.random() * (to - from)) + from;
};

const validNick = (nickname) => {
  const regex = /^\w*$/;
  // debug('Regex Test', regex.exec(playerNameInput.value));
  // return regex.exec(nickname) !== null;
  return true;
};

// determine mass from radius of circle
const massToRadius = (mass) => {
  return 4 + Math.sqrt(mass) * 6;
};

export function getDashoffset(configTime, bTime, r) {
  const now = Date.now() - bTime;
  const delta = configTime - (now / 1000);
  const val = Math.round((delta / configTime) * 100);
  const c = Math.PI * (r * 2);
  const pct = ((100 - val) / 100) * c;
  return pct;
}

// overwrite Math.log function
const log = (() => {
  return (n, base) => {
    return Math.log(n) / (base ? Math.log(base) : 1);
  };
})();

// get the Euclidean distance between the edges of two shapes
const getDistance = (p1, p2) => {
  if (p1 && p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) - p1.radius - p2.radius;
  }
};

// generate a random position within the field of play
const randomPosition = (radius) => {
  return {
    x: randomInRange(radius, Config.gameWidth - radius),
    y: randomInRange(radius, Config.gameHeight - radius)
  };
};

const uniformPosition = (points, radius) => {
  let bestCandidate;
  let maxDistance = 0;
  const numberOfCandidates = 10;

  if (points.length === 0) {
    return randomPosition(radius);
  }

  // Generate the cadidates
  for (let ci = 0; ci < numberOfCandidates; ci++) {
    let minDistance = Infinity;
    const candidate = randomPosition(radius);
    candidate.radius = radius;

    for (let pi = 0; pi < points.length; pi++) {
      const distance = getDistance(candidate, points[pi]);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    if (minDistance > maxDistance) {
      bestCandidate = candidate;
      maxDistance = minDistance;
    } else {
      return randomPosition(radius);
    }
  }

  return bestCandidate;
};

const findIndex = (arr, id) => {
  let len = arr.length;

  while (len--) {
    if (arr[len].id === id) {
      return len;
    }
  }

  return -1;
};

const randomColor = () => {
  const color = `#${('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6)}`;
  const c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const r = (parseInt(c[1], 16) - 32) > 0 ? (parseInt(c[1], 16) - 32) : 0;
  const g = (parseInt(c[2], 16) - 32) > 0 ? (parseInt(c[2], 16) - 32) : 0;
  const b = (parseInt(c[3], 16) - 32) > 0 ? (parseInt(c[3], 16) - 32) : 0;

  return {
    fill: color,
    border: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  };
};

const randomProperty = (obj) => {
  const keys = Object.keys(obj);
  if (Math.round(Math.random()) === 1) {
  return keys[keys.length * Math.random() << 0];
  }
  else { return keys[Math.floor(Math.random())];}
};

const upLetter = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const valueInRange = (min, max, value) => {
  return Math.min(max, Math.max(min, value));
};

export {
  randomInRange,
  validNick,
  massToRadius,
  log,
  getDistance,
  randomPosition,
  uniformPosition,
  findIndex,
  randomColor,
  randomProperty,
  upLetter,
  valueInRange
};

export default {
  users: 0,
  leaderboardChanged: false,
  timeDelta: Date.now()
};
