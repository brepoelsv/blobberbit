import Renderer from './renderer';
let m = false;

if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  m = true;
}

export const playerNameInput = document.getElementById('playerNameInput');
export var c = document.getElementById('cvs');
export const renderer = new Renderer(c);
export const graph = renderer.graph;
export const input = document.getElementById('chatInput');
export const chatList = document.getElementById('chatList');
//export const scoreId = document.getElementById('score');
export const coordinatesId = document.getElementById('coordinates');
//export const massId = document.getElementById('mass');
export const btnS = document.getElementById('spectateButton');
export const settingsMenu = document.getElementById('settingsButton');
export const settings = document.getElementById('settings');
export const cellId = document.getElementById('split_cell');
export const feedId = document.getElementById('feed');
export const splitId = document.getElementById('split');
export const btnExit = document.getElementById('exitButton');
export const btn = document.getElementById('startButton');
export const firstColumn = document.getElementById('firstColumn');
export const secondColumn =  document.getElementById('secondColumn');
export const startMenuLoading = document.getElementById('startMenuLoading');
export const startMenu = document.getElementById('startMenu');
export const startMenuAdvert = document.getElementById('startMenuAdvert');
export const startMenuChangelog = document.getElementById('startMenuChangelog');
// export const spawnCell = document.getElementById('spawn_cell');
export const startMenuWrapper = document.getElementById('startMenuWrapper');
export const bottomBanner = document.getElementById('bottomBanner');
export const optionButtons = document.getElementById('optionButtons');
export const gameAreaWrapper = document.getElementById('gameAreaWrapper');
export const RightBonuses = document.getElementById('rightBonuses');
export const BottomBonuses = document.getElementById('bottomBonuses');
export const miniMap = document.getElementById('miniMap');
export const modalShop = UIkit.modal('#modalShop', {
  modal: false,
  center: true
});
export const modalCoins = UIkit.modal('#coinsShop', {
  modal: false,
  center: true
});
export const modalLogin = UIkit.modal('#modalLogin', {
  modal: true,
  center: true
});
export const modalSkins = UIkit.modal('#skinsShop', {
  modal: false,
  center: true
});
export const modalMass = UIkit.modal('#massShop', {
  modal: false,
  center: false
});
export const modalXP = UIkit.modal('#xpShop', {
  modal: false,
  center: false
});
export const rightBonuses = $('#rightBonuses');
export const bottomBonuses = $('#bottomBonuses');
export const dropPowers = $('.link-power');
export const bChat = $('#chatbox');
export const bChatbox = $('.button-chatbox');
export const bChaticon = $('.button-chatbox > i');
export const bTheme = $('.button-theme');
export const bThemeicon = $('.button-theme > i');
export const bMass = $('.button-mass');
export const bMassicon = $('.button-mass > i');
export const bLeaderboard = $('#status');
export const bLeaderbuttons = $('.button-leaderboard');
export const bLeadericon = $('.button-leaderboard > i');
export const shownamebuttons = $('.button-showname');
export const shownameicon = $('.button-showname > i');
export const mobile = m;
export const chatbox = document.getElementById('chatbox');
