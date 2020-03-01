<div id="fb-root"></div>
<!-- <script>
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
</script>
<script>
    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0]
            , t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };
        return t;
    }(document, "script", "twitter-wjs"));
</script> -->
<style>
 #startMenuLoading {
   width: 298px;
 }
</style>
<script>
 window.leaderboard = {{user.options.leaderboard}};
 window.chat = {{user.options.chat}};
 {{#user.options.server}}
 window.server = '{{user.options.server}}';
 {{/user.options.server}}
</script>
<div id="gameAreaWrapper">
    <div id="rightBonuses" class="uk-hidden"></div>
    <div id="bottomBonuses" class="uk-hidden"></div>
    <!--<div id="score" class="uk-hidden">Score: 0</div> -->
    <!--<div id="mass" class="uk-hidden">BlobMass: 0</div> -->
    <div id="coordinates" class="uk-hidden">x: 0 y: 0</div>
    <div id="chatbox" class="chatbox uk-form uk-hidden">
        <input id="chat_textbox" type="text" class="uk-form-row chat-input" placeholder="Press enter to chat!" maxlength="200" />
    </div>
    <canvas tabindex="1" id="cvs" class="uk-height-1-1 uk-width-1-1"></canvas>
</div>
<div id="startMenuWrapper" class="uk-height-1-1 uk-flex uk-flex-center uk-flex-middle">
    <div id="startMenuHello" class="uk-flex uk-flex-center">
        <div id="firstColumn" class="uk-hidden">
          <div id="startMenuProfile" class="uk-panel uk-panel-box uk-margin-bottom">
            <iframe id="IOG_CP" scrolling="no" frameborder="0" width="200"
            height="145" src="https://viral.iogames.space/cp/blobber-io"
            style="border-radius:10px;-webkit-box-shadow:0 3px 6px rgba(0,0,0,.25),0 3px 6px rgba(0,0,0,.4);
            -moz-box-shadow:0 3px 6px rgba(0,0,0,.25),0 3px 6px rgba(0,0,0,.4);
            box-shadow:0 3px 6px rgba(0,0,0,.25),0 3px 6px rgba(0,0,0,.4);">
            </iframe>
          </div>
                      <a id="moreiogamesButton" href="http://iogames.space/" class="uk-button uk-width-1-1 uk-button-large uk-button-success" target ="_blank">More .io games</a>
        </div>
         <div id="secondColumn" class="uk-hidden">
        <!--    <div id="startMenuProfile" class="uk-panel uk-panel-box uk-margin-bottom">
                <article class="uk-comment">
                    <header class="uk-comment-header">
                        // img class="uk-comment-avatar" src="/app/img/profilepic_guest.png" alt="">
                        //     <h4 class="uk-comment-title">Guest</h4>
                        <div id="profileCoins" class="uk-comment-meta uk-margin-top">
                            <img id="iconCoin" src="/app/img/currency_icon.png" />
                            <p id="profileBalance">{{account.coins}}</p>
                            <a id="plusProfileCoins" data-uk-modal="{target:'#coinsShop', center:true}">
                                <svg width="26" height="26" baseProfile="full" version="1.2">
                                    <g>
                                        <circle cx="13px" cy="13px" r="11px" stroke="#55b300" stroke-width="2px" fill="#69dd00" />
                                        <text x="13px" y="10px" text-anchor="middle" stroke="white" stroke-width="0.1px" dy="10px" font-size="25px" fill="white">+</text>
                                    </g>
                                </svg>
                            </a>
                        </div>
                    </header>
                    <div class="uk-progress">
                        <div id="progress-bar" class="uk-progress-bar" style="width: {{account.progress}}%;">{{account.score}}/{{account.nextLevel}}</div>
                        <div id="progress-bar-star">{{account.level}}</div>
                    </div>
                </article>
            </div> -->
            <!-- <div id="startMenuShop" class="uk-panel uk-panel-box uk-margin-bottom">
                 <button id="shopButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success" data-uk-modal="{target:'#modalShop', center:true}">Shop</button>
                <div id="shopUnderButton" class="uk-flex uk-margin-top">
                    <div id="shopSkins" class="uk-text-center" data-uk-modal="{target:'#skinsShop', center:true}">
                        {{#account.sprite}}
                        <div id="playerAvatar" class="b-userAvatar uk-container-center" style="background-position: -{{account.sprite.x}}px -{{account.sprite.y}}px"></div>
                        {{/account.sprite}}
                        {{^account.sprite}}
                        <div id="playerAvatar" class="uk-container-center">
                            <svg width="128" height="128" baseProfile="full" version="1.2">
                                <defs>
                                    <mask id="svgmask2" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" transform="scale(1)">
                                        <image width="100%" height="100%" xlink:href="/app/img/defaultblob.png"/>
                                    </mask>
                                </defs>
                                <rect id="svgmask" mask="url(#svgmask2)" width="100%" height="100%" />
                            </svg>
                        </div>
                        {{/account.sprite}}
                        <a id="plusShopSkins" data-uk-modal="{target:'#skinsShop', center:true}">
                            <svg width="26" height="26" baseProfile="full" version="1.2">
                                <g>
                                    <circle cx="13px" cy="13px" r="11px" stroke="#55b300" stroke-width="2px" fill="#69dd00" />
                                    <text x="13px" y="10px" text-anchor="middle" stroke="white" stroke-width="0.1px" dy="10px" font-size="25px" fill="white">+</text>
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        -->
          <!--  <a id="moreiogamesButton" href="http://iogames.space/" class="uk-button uk-width-1-1 uk-button-large uk-button-success" target ="_blank">More .io games</a> -->
        </div>

        <div id="thirdColumn" class="uk-margin-left uk-margin-right">
            <div id="startMenuLoading" class="uk-panel uk-panel-box uk-margin-bottom">
                <svg class="spinner-container uk-align-center" width="65px" height="65px" viewBox="0 0 52 52">
                    <circle class="path" cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px" /> </svg>
                    <h1 class="uk-h2 uk-text-center">Connecting</h1>
                    <h4 class="uk-h4 uk-text-center">Loading images and searching for the fastest servers</h4>
            </div>
            <div id="startMenu" class="uk-panel uk-panel-box uk-margin-bottom uk-hidden">
                <div id="socialButton" class="uk-flex uk-flex-middle uk-flex-space-around">
                   <!--  <div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button" data-action="like" data-show-faces="false" data-share="true"></div> <a class="twitter-share-button" href="https://twitter.com/intent/tweet?text=Hello%20world">Tweet</a>
                    <div class="g-ytsubscribe" data-channel="GoogleDevelopers" data-layout="default" data-count="default"></div>  -->
                </div>
                <div id="b-logo" class="uk-margin-bottom"></div>
                {{#user.userId}}
                <form class="uk-form uk-margin-bottom">
                    <fieldset data-uk-margin>
                        {{#user.username}}
                        <input type="text" tabindex="0" autofocus placeholder="Enter your nickname" id="playerNameInput" maxlength="25" class="uk-width-1-1 uk-form-large" value="{{user.username}}" />
                        {{/user.username}}
                        {{^user.username}}
                        <input type="text" tabindex="0" autofocus placeholder="Enter your nickname" id="playerNameInput" maxlength="25" class="uk-width-1-1 uk-form-large" value="{{user.displayname}}" />
                        {{/user.username}}
                        <!-- <input type="text" tabindex="0" autofocus placeholder="Image Link Imgur" id="playerAvatarInput" maxlength="250" class="uk-width-1-1 uk-margin-top" /> -->
                    </fieldset>
                </form>
                <div id="chooseServer" class="uk-panel uk-panel-box uk-margin-bottom uk-margin-top">
                    <div data-uk-dropdown="{mode:'click', pos:'right-center'}">
                        <button class="uk-button uk-width-1-1"><span id="currentServer">Servers</span><i class="uk-icon-caret-right uk-margin-small-left"></i></button>
                        <div class="uk-dropdown uk-dropdown-bottom">
                            <ul id="chooseServerSelect" class="uk-nav uk-nav-dropdown"></ul>
                        </div>
                    </div>
               </div>
               <button id="startButton" class="uk-button uk-width-1-1 uk-button-large uk-margin-bottom uk-button-success">Play</button>
                <button id="exitButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-bottom">Exit</button>
                {{/user.userId}}
                {{^user.userId}}
                <form class="uk-form uk-margin-bottom">
                    <fieldset data-uk-margin>
                        {{#user.username}}
                        <input type="text" tabindex="0" autofocus placeholder="Nick Name" id="playerNameInput" maxlength="25" class="uk-width-1-1 uk-form-large uk-float-right" value="{{user.username}}" />
                        {{/user.username}}
                        {{^user.username}}
                        <input type="text" tabindex="0" autofocus placeholder="Nick Name" id="playerNameInput" maxlength="25" class="uk-width-1-1 uk-form-large uk-float-right" />
                        {{/user.username}}
                        <!-- <input type="text" tabindex="0" autofocus placeholder="Image Link Imgur" id="playerAvatarInput" maxlength="250" class="uk-width-1-1 uk-margin-top" /> -->
                      </fieldset>
                </form>
              <!--   <div id="chooseServer" class="uk-panel uk-panel-box uk-margin-bottom uk-margin-top">
                    <div data-uk-dropdown="{mode:'click', pos:'right-center'}">
                        <button class="uk-button uk-width-1-1"><span id="currentServer">Servers</span><i class="uk-icon-caret-right uk-margin-small-left"></i></button>
                        <div class="uk-dropdown uk-dropdown-bottom">
                            <ul id="chooseServerSelect" class="uk-nav uk-nav-dropdown"></ul>
                        </div>
                    </div>
                </div>
             -->
                <button id="startButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-bottom">Play</button>
                <!-- <div class="uk-button-group uk-margin-bottom uk-flex uk-flex-center">
                    <a class="uk-button uk-contrast b-facebook" href="/login/facebook"> <i class="uk-icon-facebook uk-margin-small-right"></i>Facebook</a>
                    <a class="uk-button uk-contrast b-google" href="/login/google"> <i class="uk-icon-google-plus uk-margin-small-right"></i>Google+</a>
                    <a class="uk-button uk-contrast b-twitter" href="/login/twitter"> <i class="uk-icon-twitter uk-margin-small-right"></i>Twitter</a>
                </div>
                -->
                {{/user.userId}}
                <button id="spectateButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-bottom">Spectate</button>
                {{#user.options}}
                <button id="settingsButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success">Settings</button>
                <div id="settings" class="uk-hidden">
                    <h3>Settings</h3>
                    <ul>
                        {{#user.options.chat}}
                        <label>
                            <input id="showChat" name="chat" type="checkbox" checked>Show chatbox
                        </label>
                        {{/user.options.chat}}
                        {{^user.options.chat}}
                        <label>
                            <input id="showChat" name="chat" type="checkbox">Show chatbox
                        </label>
                        {{/user.options.chat}}
                        {{#user.options.dark}}
                        <label>
                            <input id="darkTheme" name="dark" type="checkbox" checked>Dark Theme
                        </label>
                        {{/user.options.dark}}
                        {{^user.options.dark}}
                        <label>
                            <input id="darkTheme" name="dark" type="checkbox">Dark Theme
                        </label>
                        {{/user.options.dark}}
                        <br />
                        {{#user.options.leaderboard}}
                        <label>
                            <input id="showLeaderboard" name="leaderboard" type="checkbox" checked>Show leaderboard
                        </label>
                        {{/user.options.leaderboard}}
                        {{^user.options.leaderboard}}
                        <label>
                            <input id="showLeaderboard" name="leaderboard" type="checkbox">Show leaderboard
                        </label>
                        {{/user.options.leaderboard}}
                        <br />
                        {{#user.options.border}}
                        <label>
                            <input id="showBorder" name="border" type="checkbox" checked>Show border
                        </label>
                        {{/user.options.border}}
                        {{^user.options.border}}
                        <label>
                            <input id="showBorder" name="border" type="checkbox">Show border
                        </label>
                        {{/user.options.border}}
                        {{#user.options.mass}}
                        <label>
                            <input id="showMass" name="mass" type="checkbox" checked>Show mass
                        </label>
                        {{/user.options.mass}}
                        {{^user.options.mass}}
                        <label>
                            <input id="showMass" name="mass" type="checkbox">Show mass
                        </label>
                        {{/user.options.mass}}
                        <br />
                        {{#user.options.move}}
                        <label>
                            <input id="continuity" name="move" type="checkbox" checked>Continue moving when mouse is off-screen
                        </label>
                        {{/user.options.move}}
                        {{^user.options.move}}
                        <label>
                            <input id="continuity" name="move" type="checkbox">Continue moving when mouse is off-screen
                        </label>
                        {{/user.options.move}}
                        {{#user.options.displayname}}
                        <label>
                            <input id="showName" name="displayname" type="checkbox" checked>Show Name
                        </label>
                        {{/user.options.displayname}}
                        {{^user.options.displayname}}
                        <label>
                            <input id="showName" name="displayname" type="checkbox">Show Name
                        </label>
                        {{/user.options.displayname}}
                    </ul>
                </div>
                {{/user.options}}
            </div>
        </div>
        <div id="fourthColumn">
            <div id="startMenuAdvert" class="uk-panel uk-panel-box uk-margin-bottom">
                <!-- midsplash -->
                <ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9490373085041113" data-ad-slot="4099605319"></ins>
                <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            <!--<div id="startMenuChangelog" class="uk-panel uk-panel-box uk-margin-bottom">
                <p><a href="/changelog" title="Changelog">{{changelog.title}}</a></p>
                {{& changelog.body}}
            </div>
            -->
            <div id="startMenuChangelog" class="uk-panel uk-panel-box uk-margin-top">
                <span style="color:#07D"><p>Controls</p></span>
                <ul><li>Mouse to move</li>
                <li>Spacebar to Split</li>
                <li>W to eject mass</li>
                <li>ESC to menu</li>
                
                    <!--<li>- + to zoom in/out</li>
                <li>Mouse scroll to zoom in/out</li>--></ul>
            </div>
        </div>
    </div>
</div>
<div id="statWrapper" class="uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-hidden">
    <div id="statHello" class="uk-flex uk-flex-center uk-flex-column">
        <div id="stat" class="uk-panel uk-panel-box uk-margin-bottom uk-margin-top">
            <div id="gameStatInfo">
                <h4>Match Result</h4>
                <div>
                    <span>Food Eaten<br/><span id="foodEeaten">0</span></span>
                    <span>Highest Mass<br/><span id="highMass">0</span></span>
                </div>
                <div>
                    <span>Time Alive<br/><span id="timeAlive">0:00</span></span>
                    <span>LeaderBoard Time<br/><span id="leaderTime">0:00</span></span>
                </div>
                <div>
                    <span>Blobs Eaten<br/><span id="cellEaten">0</span></span>
                    <span>Top Position<br/><span id="topPosition">0</span></span>
                </div>
            </div>
            <div id="gameStats" class="gameStat uk-width-1-1"></div>
            <button id="continuePlay" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-top">Continue</button>
        </div>
        {{#production}}
        <div id="statsAdvert" class="uk-panel uk-panel-box">

            <ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9490373085041113" data-ad-slot="4099605319"></ins>
            <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
        {{/production}}
    </div>
</div>

<div id="modalLogin" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>Feature not available for Guests. You need to login</h2>
        <div class="uk-flex uk-flex-column">
            <a href=""></a>
            <a class="uk-button b-google uk-contrast uk-align-center" href="/login/google"> <i class="uk-icon-google-plus uk-margin-small-right"></i>Sign in with Google+</a>
            <a class="uk-button b-facebook uk-contrast uk-align-center" href="/login/facebook"> <i class="uk-icon-facebook uk-margin-small-right"></i>Sign in with Facebook</a>
            <a class="uk-button b-twitter uk-contrast uk-align-center" href="/login/twitter"> <i class="uk-icon-twitter uk-margin-small-right"></i>Sign in with Twitter</a>
        </div>
    </div>
</div>
<div id="modalShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <div class="uk-flex">
            <div class="uk-margin-small-right">
                <a class="uk-thumbnail uk-margin-small-bottom" data-uk-modal="{target:'#coinsShop', modal:false,center:true}"> <img src="/app/img/coins2.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>Coins</h2></div>
                </a>
                <a class="uk-thumbnail uk-margin-small-top" data-uk-modal="{target:'#skinsShop', modal:false,center:true}"> <img src="/app/img/skins.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>Skins</h2></div>
                </a>
            </div>
            <div class="uk-margin-small-left">
                <a class="uk-thumbnail uk-margin-small-bottom" data-uk-modal="{target:'#massShop', modal:false,center:false}"> <img src="/app/img/massboost.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>Mass Boost</h2></div>
                </a>
                <a class="uk-thumbnail uk-margin-small-top" data-uk-modal="{target:'#XPShop', modal:false,center:false}"> <img src="/app/img/xpboost.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>XP Boost</h2></div>
                </a>
            </div>
        </div>
    </div>
</div>
<div id="coinsShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>Coins</h2>
        <table class="uk-table uk-table-hover uk-table-striped">
            <tbody>
                {{#currencies}}
                <tr>
                    <td class="uk-table-middle">{{description.en}}</td>
                    <td class="uk-table-middle">
                        {{#recommend}}
                        <span class="uk-badge uk-badge-warning">Recommend</span>
                        {{/recommend}}
                        {{#bestdeal}}
                        <span class="uk-badge uk-badge-danger">Best Deal</span>
                        {{/bestdeal}}
                    </td>
                    <td class="uk-table-middle"><i class="uk-icon-currency uk-margin-small-right"></i>{{amount}}</td>
                    <td class="uk-table-middle">${{price}}</td>
                    <td>
                        <button id="cur{{id}}" class="b-currency-button uk-button uk-button-success" type="button">Buy</button>
                    </td>
                </tr>
                {{/currencies}}
            </tbody>
        </table>
    </div>
</div>
<div id="skinsShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>Skins</h2>
        <ul class="uk-tab uk-tab-grid uk-tab-bottom" data-uk-switcher="{connect:'#subnav'}">
            {{#groups}}
            <li class="uk-width-1-5"><a>{{name.en}}</a></li>
            {{/groups}}
        </ul>
        <ul id="subnav" class="uk-switcher">
            {{#groups}}
            {{#first}}
            <li class="uk-active">
            {{/first}}
            {{^first}}
            <li>
            {{/first}}
                <ul id="switch-multiple-{{id}}" class="uk-switcher">
                    {{#items}}
                    {{#fst}}
                    <li class="uk-active">
                    {{/fst}}
                    {{^fst}}
                    <li>
                    {{/fst}}
                        <div class="uk-margin-large">
                            {{#itm}}
                            {{#level}}
                            {{#unlocked}}
                            <a id="itm{{idi}}" class="b-item b-use uk-thumbnail uk-margin-small-right uk-margin-small-top">
                            {{/unlocked}}
                            {{^unlocked}}
                            <a id="itm{{idi}}" class="b-item uk-thumbnail uk-margin-small-right uk-margin-small-top">
                            {{/unlocked}}
                                <h3>{{name.en}}</h3>
                                <img class="b-item-skin uk-margin-large-top uk-margin-small-bottom uk-align-center" src="{{image}}" alt="">
                                <div class="uk-thumbnail-caption">
                                    {{#unlocked}}
                                    <button id="itm{{idi}}" class="b-item-button b-use uk-button uk-button-primary" type="button">Use</button>
                                    {{/unlocked}}
                                    {{^unlocked}}
                                    <button id="itm{{idi}}" class="b-item-button uk-button uk-button-primary" type="button" disabled><i class="uk-icon-lock"></i> Level {{price}}</button>
                                    {{/unlocked}}
                                </div>
                            </a>
                            {{/level}}
                            {{^level}}
                            {{#owned}}
                            <a id="itm{{idi}}" class="b-item b-use uk-thumbnail uk-margin-small-right uk-margin-small-top">
                            {{/owned}}
                            {{^owned}}
                            {{#have}}
                            <a id="itm{{idi}}" class="b-item uk-thumbnail uk-margin-small-right uk-margin-small-top">
                            {{/have}}
                            {{^have}}
                            <a id="itm{{idi}}" class="b-item buy uk-thumbnail uk-margin-small-right uk-margin-small-top">
                            {{/have}}
                            {{/owned}}
                                <h3>{{name.en}}</h3>
                                <img class="b-item-skin uk-margin-large-top uk-margin-small-bottom uk-align-center" src="{{image}}" alt="">
                                <div class="uk-thumbnail-caption">
                                    {{#owned}}
                                    {{#code}}
                                    <button id="itm{{idi}}" class="b-item-button uk-button uk-button-primary" type="button" disabled>Using</button>
                                    {{/code}}
                                    {{^code}}
                                    <button id="itm{{idi}}" class="b-item-button b-use uk-button uk-button-primary" type="button">Use</button>
                                    {{/code}}
                                    {{/owned}}
                                    {{^owned}}
                                    {{#have}}
                                    <button id="itm{{idi}}" class="b-item-button uk-button uk-button-primary" type="button" disabled>Owned</button>
                                    {{/have}}
                                    {{^have}}
                                    <button id="itm{{idi}}" class="b-item-button uk-button uk-button-primary" type="button"><i class="uk-icon-currency uk-margin-small-right"></i>{{price}}</button>
                                    {{/have}}
                                    {{/owned}}
                                </div>
                            </a>
                            {{/level}}
                            {{/itm}}
                        </div>
                    </li>
                    {{/items}}
                </ul>
                <ul class="uk-pagination" data-uk-switcher="{connect:'#switch-multiple-{{id}}'}">
                    {{#items}}
                    {{#fst}}
                    <li class="uk-active">
                    {{/fst}}
                    {{^fst}}
                    <li>
                    {{/fst}}
                        <span>{{page}}</span>
                    </li>
                    {{/items}}
                </ul>
            </li>
            {{/groups}}
        </ul>
    </div>
</div>
<div id="massShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>Mass Boost</h2>
        <div class="uk-slidenav-position" data-uk-slider="{infinite: false}" data-uk-check-display>
            <div class="uk-slider-container">
                <ul class="uk-slider uk-grid-small uk-grid-width-medium-1-2">
                    {{#massBoost}}
                    <li>
                        <div class="massBoostItem">
                            <h3 class="uk-text-center">
                                {{name.en}}
                                {{#recommend}}
                                <span class="uk-badge uk-badge-warning uk-margin-small-bottom">Recommend</span>
                                {{/recommend}}
                                {{#bestdeal}}
                                <span class="uk-badge uk-badge-danger uk-margin-small-bottom">Best Deal</span>
                                {{/bestdeal}}
                            </h3>
                            <div class="itemImage">
                                <img src="{{image}}" alt="" />
                            </div>
                            <button id="itm{{idi}}" class="b-item-button buy-boost uk-button uk-button-primary uk-align-center" type="button"><i class="uk-icon-currency uk-margin-small-right"></i>{{price}}</button>
                        </div>
                    </li>
                    {{/massBoost}}
                </ul>
            </div>
            <a href="" class="uk-slidenav uk-slidenav-previous" data-uk-slider-item="previous"></a>
            <a href="" class="uk-slidenav uk-slidenav-next" data-uk-slider-item="next"></a>
        </div>
    </div>
</div>
<div id="XPShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>XP Boost</h2>
        <div class="uk-slidenav-position" data-uk-slider="{infinite: false}" data-uk-check-display>
            <div class="uk-slider-container">
                <ul class="uk-slider uk-grid-small uk-grid-width-medium-1-2">
                    {{#xpBoost}}
                    <li>
                        <div class="xpBoostItem">
                            <h3 class="uk-text-center">
                                {{name.en}}
                                {{#recommend}}
                                <span class="uk-badge uk-badge-warning uk-margin-small-bottom">Recommend</span>
                                {{/recommend}}
                                {{#bestdeal}}
                                <span class="uk-badge uk-badge-danger uk-margin-small-bottom">Best Deal</span>
                                {{/bestdeal}}
                            </h3>
                            <img src="{{image}}" alt="" />
                            <button id="itm{{idi}}" class="b-item-button buy-boost uk-button uk-button-primary uk-align-center" type="button"><i class="uk-icon-currency uk-margin-small-right"></i>{{price}}</button>
                        </div>
                    </li>
                    {{/xpBoost}}
                </ul>
            </div>
            <a href="" class="uk-slidenav uk-slidenav-previous" data-uk-slider-item="previous"></a>
            <a href="" class="uk-slidenav uk-slidenav-next" data-uk-slider-item="next"></a>
        </div>
    </div>
</div>
<div id="optionButtons" class="uk-hidden">
    <div class="uk-button-dropdown" data-uk-dropdown="{mode:'click'}">
        {{#powers.droplist}}
        {{#value}}
        <button id="powerName" class="uk-button b-power-name uk-button-primary"> {{key}} <i class="uk-icon-caret-up"></i> </button>
        {{/value}}
        {{/powers.droplist}}
        <div class="uk-dropdown uk-dropdown-small">
          <ul id="dropPowers" class="uk-nav uk-nav-dropdown b-powers">
            {{#powers.droplist}}
            {{#value}}
            <li><a class="link-power power-current" name="{{key}}">{{key}}</a></li>
            {{/value}}
            {{^value}}
            <li><a class="link-power" name="{{key}}">{{key}}</a></li>
            {{/value}}
            {{/powers.droplist}}
          </ul>
        </div>
    </div>
    <div class="uk-button-group">
      {{#user.options.chat}}
        <button class="uk-button uk-button-primary button-chatbox"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-chatbox">Chatbox</button>
        {{/user.options.chat}}
        {{^user.options.chat}}
        <button class="uk-button uk-button-danger button-chatbox uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-chatbox uk-active">Chatbox</button>
        {{/user.options.chat}}
    </div>
    <div class="uk-button-group">
      {{#user.options.dark}}
        <button class="uk-button uk-button-danger button-theme uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-theme uk-active">Dark Theme</button>
        {{/user.options.dark}}
        {{^user.options.dark}}
        <button class="uk-button uk-button-primary button-theme"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-theme">Dark Theme</button>
        {{/user.options.dark}}
    </div>
    <div class="uk-button-group">
      {{#user.options.mass}}
        <button class="uk-button uk-button-danger button-mass uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-mass uk-active">Show Mass</button>
        {{/user.options.mass}}
        {{^user.options.mass}}
        <button class="uk-button uk-button-primary button-mass"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-mass">Show Mass</button>
        {{/user.options.mass}}
    </div>
    <div class="uk-button-group">
      {{#user.options.leaderboard}}
        <button class="uk-button uk-button-primary button-leaderboard"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-leaderboard">Leaderboard</button>
        {{/user.options.leaderboard}}
        {{^user.options.leaderboard}}
        <button class="uk-button uk-button-danger button-leaderboard uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-leaderboard uk-active">Leaderboard</button>
        {{/user.options.leaderboard}}
    </div>
    <div class="uk-button-group">
      {{#user.options.displayname}}
        <button class="uk-button uk-button-danger button-showname uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-showname uk-active">Display Name</button>
        {{/user.options.displayname}}
        {{^user.options.displayname}}
        <button class="uk-button uk-button-primary button-showname"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-showname">Display Name</button>
        {{/user.options.displayname}}
    </div>
</div>
{{#production}}
<div id="bottomBanner" class="uk-panel uk-panel-box">
    <ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-9490373085041113" data-ad-slot="7611474913"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
{{/production}}
<script src="https://apis.google.com/js/platform.js"></script>
