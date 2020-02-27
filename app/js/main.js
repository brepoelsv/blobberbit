// IMPORT ASSETS
import '../css/app.scss';
import 'uikit/dist/css/uikit.css';
import 'uikit/dist/css/uikit.almost-flat.css';
import 'uikit/dist/css/components/progress.css';
import 'uikit/dist/css/components/progress.almost-flat.css';
import 'uikit/dist/css/components/slider.css';
import 'uikit/dist/css/components/slider.almost-flat.css';
import 'uikit/dist/css/components/slidenav.css';
import 'uikit/dist/css/components/slidenav.almost-flat.css';
import 'uikit/dist/js/uikit.js';
import 'uikit/dist/js/core/core.js';
import 'uikit/dist/js/core/modal.js';
import 'uikit/dist/js/core/switcher.js';
import 'uikit/dist/js/components/slider.js';
import './minimap';
import toggleDarkMode from './toggleDarkMode';
import toggleName     from './toggleName';
import toggleMass     from './toggleMass';
import toggleButtons  from './button';

import './button';
import './assets';
import {
  GlobalEventHandler
} from './Event';
import GAMESTAT       from './gameStat';

import {
  checkImageSrcValid,
  preprocessImageSrc
} from './utilities';

import {
  validNick
} from '../../server/lib/util';

import {
  KEY_ESC,
  KEY_ENTER,
  KEY_CHAT,
  KEY_FIREFOOD,
  KEY_POWER,
  KEY_LEFT,
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN
} from './keys';

import {
  playerNameInput,
  c,
  renderer,
  input,
  btnS,
  settingsMenu,
  settings,
  cellId,
  feedId,
  splitId,
  btnExit,
  btn,
  dropPowers,
  bChat,
  bChatbox,
  bChaticon,
  bTheme,
  bThemeicon,
  bMass,
  bMassicon,
  bLeaderboard,
  bLeaderbuttons,
  bLeadericon,
  shownamebuttons,
  shownameicon,
  modalShop,
  modalCoins,
  modalLogin,
  modalSkins,
  modalMass,
  modalXP,
  firstColumn,
  startMenuLoading,
  startMenu,
  startMenuAdvert,
  startMenuChangelog,
  spawnCell
} from './dom';

import {
  directions
} from './objects';

import vars, {
  debug
} from './variables';

import {
  player
} from './player';

import target         from './target';
import toggleGameMenu from './gameMenu';

import {
  startGame
} from './startGame';

import loadListServer from './listServers';

window.onload = () => {
  if (window.production) {
    firstColumn.className = 'uk-animation-slide-top';
    //secondColumn.className = 'uk-animation-slide-top';
    startMenuLoading.className = 'uk-hidden';
    startMenu.className = 'uk-panel uk-panel-box uk-margin-bottom uk-animation-slide-left';
    startMenuAdvert.className = 'uk-panel uk-panel-box uk-animation-slide-left uk-margin-bottom';
    startMenuChangelog.className = 'uk-panel uk-panel-box uk-animation-slide-left';
  } else {
    firstColumn.className = 'uk-animation-slide-top';
    //secondColumn.className = 'uk-animation-slide-top';
    startMenuLoading.className = 'uk-hidden';
    startMenu.className = 'uk-panel uk-panel-box uk-margin-bottom uk-animation-slide-left';
  }
  if (btn !== null) {
    btn.onclick = () => {
      // Checks if the nick is valid.
      if (validNick()) {
        vars.spectateMode = false;
        // nickErrorText.style.opacity = 0;
        // spawnCell.play();
        startGame('player');
      } else {
        // nickErrorText.style.opacity = 1;
      }
    };
  }

  if (btnExit !== null) {
    btnExit.onclick = () => {
      $.post('/logout', data => {
        if (data === 'OK') {
          window.location.reload(true);
        }
      });
    };
  }
  // const nickErrorText = document.querySelector('#startMenu .input-error');

  btnS.onclick = () => {
    startGame('spectate');
    toggleGameMenu(false);
    vars.spectateMode = true;
  };

  settingsMenu.onclick = () => {
    if (settings.classList[0] === 'uk-hidden') {
      settings.className = 'uk-animation-fade uk-margin-top';
    } else {
      settings.className = 'uk-hidden';
    }
  };

  dropPowers.click(function() {
    dropPowers.each((i, link) => {
      if (link.classList[1] !== 'power-current') {
        link.className = 'link-power';
      }
    });
    if (this.classList[1] !== 'power-current') {
      this.className = 'link-power power-next';
    }
    $.get('/session')
      .then(session => {
        // vars.socket.emit('playerPower', this.name, session);
        c.focus();
      });
  });

  $('#showBorder, #showMass, #showChat, #darkTheme, #showLeaderboard, #continuity, #showName').change(function() {
    $.post('/settings', {
      option: this.name
    });
    if (this.name === 'border') {
      toggleBorder();
    }
    if (this.name === 'displayname') {
      toggleName();
      toggleButtons(shownamebuttons[0], 'uk-active', shownamebuttons, shownameicon);
    }
    if (this.name === 'mass') {
      toggleMass();
      toggleButtons(bMass[0], 'uk-active', bMass, bMassicon);
    }
    if (this.name === 'move') {
      toggleContinuity();
    }

    if (this.name === 'dark') {
      toggleDarkMode();
      toggleButtons(bTheme[0], 'uk-active', bTheme, bThemeicon);
      renderer.updateSkin();
    }
    if (this.name === 'leaderboard') {
      toggleButtons(bLeaderboard, 'uk-hidden', bLeaderbuttons, bLeadericon);
    }
    if (this.name === 'chat') {
      toggleButtons(bChat, 'uk-hidden', bChatbox, bChaticon);
    }
  });

  $('#playerNameInput').change(function() {
    if (validNick()) {
      $.post('/settings/name', {
        nick: this.value
      });
    }
  });

   $('#playerAvatarInput').change(function() {
     const value = preprocessImageSrc(this.value);
     if (checkImageSrcValid(value) || !value) {
       clearTimeout(window._changeAvatarTimeout);
       window._changeAvatarTimeout = setTimeout(() => {
         $('#playerAvatar')[0].src = value || '/app/img/wiz01.png';
         $('#playerAvatar')[0]._src = value;
         $('#playerAvatar')[0].onload = () => $.post('/settings/avatar', {
           avatar: value || ''
         });
       }, 100);
     }
   });

  playerNameInput.addEventListener('keypress', (e) => {
    const key = e.which || e.keyCode;

    if (key === KEY_ENTER) {
      if (validNick()) {
        // nickErrorText.style.opacity = 0;
        startGame('player');
        e.preventDefault();
      } else {
        // nickErrorText.style.opacity = 1;
      }
    }
  });

  if ($('#darkTheme').prop('checked')) {
    toggleDarkMode();
  }

  if ($('#showMass').prop('checked')) {
    toggleMass();
  }

  if ($('#continuity').prop('checked')) {
    toggleContinuity();
  }

  if ($('#showBorder').prop('checked')) {
    toggleBorder();
  }

  if ($('#showName').prop('checked')) {
    toggleName();
  }

  $('.b-currency-button').on('click', function() {
    $.post('/payment/currency/token', {
      id: this.id.slice(3, this.id.length)
    }, (token) => {
      if (token === 'login') {
        modalLogin.show();
        modalShop.hide();
        modalCoins.hide();
      } else {
        modalCoins.hide();
        modalShop.hide();
        XPayStationWidget.init({
          access_token: `${token}`,
          sandbox: false
        });
        XPayStationWidget.open();
      }
    });
  });

  $(document).on('click', '.buy', function() {
    $.post('/payment/item', {
      id: this.id.slice(3, this.id.length)
    }, (resp) => {
      if (resp === 'sold') {
        const button = $(this).children().children();
        button.text('Owned');
        button.prop('disabled', true);
        let owned = $('#switch-multiple-7777777').children().children()[0];
        if (owned === undefined) {
          $('#switch-multiple-7777777').append('<li class="uk-active"><div class="uk-margin-large"></div></li>');
          $('#switch-multiple-7777777').next().append('<li class="uk-active" aria-expanded="true"><span>1</span></li>');
          owned = $('#switch-multiple-7777777').children().children()[0];
        }
        const buttonClone = $(this).clone();
        buttonClone.removeClass('buy');
        buttonClone.addClass('b-use');
        buttonClone.children().children().text('Use');
        buttonClone.children().children().prop('disabled', false);
        buttonClone.prependTo(owned);
        $.get('/payment/coins').then(coins => {
          if (coins !== 'login' && coins !== 'error') {
            $('#profileBalance').text(coins);
          }
        });
      } else if (resp === 'exist') {
        UIkit.modal.alert('Already purchased');
      } else if (resp === 'money') {
        UIkit.modal.alert('Not enough coins');
      } else if (resp === 'login') {
        modalLogin.show();
        modalShop.hide();
        modalSkins.hide();
      } else if (resp === 'error') {
        UIkit.modal.alert('Error');
      }
    });
  });

  $(document).on('click', '.b-use', function() {
    $.post('/settings/sprite', {
      id: this.id.slice(3, this.id.length)
    }, (resp) => {
      if (resp === 'changed') {
        $('.b-use').children().children().text('Use');
        $('.b-use').children().children().prop('disabled', false);
        $(this).children().children().text('Using');
        $(this).children().children().prop('disabled', true);
        $.get('/settings/sprite').then(sprite => {
          if (sprite !== 'OK') {
            $('#playerAvatar').css('backgroundPositionX', `-${sprite.x}px`);
            $('#playerAvatar').css('backgroundPositionY', `-${sprite.y}px`);
          }
        });
      } else if (resp === 'notexist') {
        UIkit.modal.alert('Item not found');
      } else if (resp === 'user') {
        UIkit.modal.alert('User not found');
      } else if (resp === 'login') {
        modalLogin.show();
        modalShop.hide();
        modalSkins.hide();
      } else if (resp === 'error') {
        UIkit.modal.alert('Error');
      }
    });
  });

  $(document).on('click', '.buy-boost', function() {
    $.post('/payment/boost', {
      id: this.id.slice(3, this.id.length)
    }, (resp) => {
      if (resp === 'sold') {
        $.get('/payment/coins').then(coins => {
          if (coins !== 'login' && coins !== 'error') {
            $('#profileBalance').text(coins);
          }
        });
      } else if (resp === 'money') {
        UIkit.modal.alert('Not enough coins');
      } else if (resp === 'login') {
        modalLogin.show();
        modalShop.hide();
        modalSkins.hide();
      } else if (resp === 'error') {
        UIkit.modal.alert('Error');
      }
    });
  });

  loadListServer();
};

// Register when the mouse goes off the canvas.
function outOfBounds() {
  if (!vars.continuity) {
    target.x = 0;
    target.y = 0;
  }
}

// Chat command callback functions.
function keyInput(event) {
  const key = event.which || event.keyCode;
  if (key === KEY_FIREFOOD && vars.reenviar) {
    // vars.socket.emit('1');
    vars.reenviar = false;
  } else if (key === KEY_POWER && vars.reenviar) {
    // cellId.play();
    // vars.socket.emit('2');
    vars.reenviar = false;
  } else if (key === KEY_CHAT) {
    input.focus();
  }
}

// feedId.onclick = () => {
//   vars.socket.emit('1');
//   vars.reenviar = false;
// };

// splitId.onclick = () => {
//   vars.socket.emit('2');
//   vars.reenviar = false;
// };

function toggleBorder() {
  if (!vars.borderDraw) {
    vars.borderDraw = true;
   /*  chat.addSystemLine('Showing border.');*/
  } else {
    vars.borderDraw = false;
   /*  chat.addSystemLine('Hiding border.');*/
  }
}


function toggleContinuity() {
  if (!vars.continuity) {
    vars.continuity = true;
    /* chat.addSystemLine('Continuity enabled.'); */
  } else {
    vars.continuity = false;
    /* chat.addSystemLine('Continuity disabled.'); */
  }
}

function gameInput(mouse) {
  if (!vars.directionLock) {
    target.x = mouse.clientX - window.innerWidth / 2;
    target.y = mouse.clientY - window.innerHeight / 2;
  }
}

function touchInput(touch) {
  touch.preventDefault();
  touch.stopPropagation();
  if (!vars.directionLock) {
    target.x = touch.touches[0].clientX - window.innerWidth / 2;
    target.y = touch.touches[0].clientY - window.innerHeight / 2;
  }
}

c.width = window.innerWidth;
c.height = window.innerHeight;
c.addEventListener('mousemove', gameInput, false);
c.addEventListener('mouseout', outOfBounds, false);
c.addEventListener('keypress', keyInput, false);
c.addEventListener('touchstart', touchInput, false);
c.addEventListener('touchmove', touchInput, false);

window.requestAnimFrame = (() => {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelAnimFrame = (() => {
  return  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
})();

GlobalEventHandler.addEventListener('TOGGLE_DARKMODE', (mode) => {
  renderer.updateSkin();
});

debug('[STARTING CLIENT]');
