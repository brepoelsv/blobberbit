import Config from './config';

const vars = {
  playerName: undefined,
  playerType: undefined,
  socket: undefined,
  chat: undefined,
  reason: undefined,
  borderDraw: true,
  serverHost: '',
  animLoopHandle: undefined,
  foodSides: 10,
  // {{{ Canvas.
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  gameWidth: 0,
  gameHeight: 0,
  // }}}
  gameStart: false,
  disconnected: false,
  died: false,
  kicked: false,
  // TODO: Break out into GameControls.
  continuity: false,
  startPingTime: 0,

  reenviar: true,
  directionLock: false,
  spectateMode: false,
  zoom: 1,

  hideChat: false,
  noRanking: false,
  teamScores: null,
  showName: true,
  teamColor: ['#333333', '#FF3333', '#33FF33', '#3333FF'],
  rawMouseX: 0,
  rawMouseY: 0,
  oldX: -1,
  oldY: -1,
  X: -1,
  Y: -1,
  viewZoom: 1,
  nodeX: 0,
  nodeY: 0,
  isTyping: false,
  ua: false,
  clearCache: true
};

export const off = {
  xoffset: -vars.gameWidth,
  yoffset: -vars.gameHeight
};

export const debug = (args) => {
  if (console && console.log) {
    console.log(args);
  }
};

export const baseWidth = Config.baseWidth;
export const baseHeight = Config.baseHeight;

export default vars;
