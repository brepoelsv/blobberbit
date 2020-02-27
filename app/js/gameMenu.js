import stats from './stats';
import {
  c,
  //scoreId,
  miniMap,
  startMenuWrapper,
  massId,
  coordinatesId,
  chatbox,
  bottomBanner,
  optionButtons,
  firstColumn,
  //secondColumn,
  startMenu,
  startMenuLoading,
  startMenuAdvert,
  startMenuChangelog,
  gameAreaWrapper,
  RightBonuses,
  BottomBonuses
} from './dom';

export default (value) => {
  if (value) {
    startMenuWrapper.className = 'uk-height-1-1 uk-flex uk-flex-center uk-flex-middle';
    miniMap.className = 'uk-hidden';
    //scoreId.className = 'uk-hidden';
   // massId.className = 'uk-hidden';
    coordinatesId.className = 'uk-hidden';
    let timer1 = setTimeout(function tick() {
      if (document.getElementById('canvasChat')) {
        document.getElementById('canvasChat').className = 'uk-hidden';
        clearTimeout(timer1);
      } else {
        timer1 = setTimeout(tick, 100);
      }
    }, 100);
    let timer2 = setTimeout(function tick() {
      if (document.getElementById('canvasLeaderboard')) {
        document.getElementById('canvasLeaderboard').className = 'uk-hidden';
        clearTimeout(timer2);
      } else {
        timer2 = setTimeout(tick, 100);
      }
    }, 100);
    chatbox.className = 'chatbox uk-form uk-hidden';
    if (window.production) {
      bottomBanner.className = 'uk-panel uk-panel-box';
    }
    optionButtons.className = 'uk-hidden';
    firstColumn.className = 'uk-animation-slide-top';
    //secondColumn.className = 'uk-animation-slide-top';
    startMenuLoading.className = 'uk-hidden';
    startMenu.className = 'uk-panel uk-panel-box uk-margin-bottom uk-animation-slide-left';
    if (window.production) {
      startMenuAdvert.className = 'uk-panel uk-panel-box uk-animation-slide-left uk-margin-bottom';
    }
    startMenuChangelog.className = 'uk-panel uk-panel-box uk-animation-slide-left';
    RightBonuses.className = 'uk-hidden';
    BottomBonuses.className = 'uk-hidden';
  } else {
    startMenuWrapper.className = 'uk-hidden';
    gameAreaWrapper.className = '';
    miniMap.className = '';
    //scoreId.className = '';
    //massId.className = '';
    //console.log(window.leaderboard);
    //console.log("LEADERBOARD");
    if (window.leaderboard) {
      document.getElementById('canvasLeaderboard').className = '';
    }
    if (window.chat) {
      document.getElementById('canvasChat').className = '';
      chatbox.className = 'chatbox uk-form';
    }
    coordinatesId.className = '';
    RightBonuses.className = '';
    BottomBonuses.className = '';
    if (window.production) {
      bottomBanner.className = 'uk-hidden';
    }
    // optionButtons.className = '';
    document.body.appendChild(stats.dom);
    c.focus();
  }
};
