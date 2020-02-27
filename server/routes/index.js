import { Router }   from 'express';
import Debug        from 'debug';
import eachSeries   from 'async/eachSeries';
import request      from 'request';
import crypto       from 'crypto';
import moment       from 'moment';
import rollbar      from 'rollbar';
import { markdown } from 'markdown';
import changelog    from 'changelog-parser';
import fs           from 'fs';
import models       from '../models/index';
import Config       from '../../config.json';
import Levels       from '../../levels.js';
import sprites      from '../../app/js/sprites.js';
import sprite       from '../../app/assets/sprite.json';
import objWithUsers from '../lib/util';
import log          from '../lib/logs.js';

rollbar.init(process.env.ROLLBAR_SERVER);

const router = new Router();
const debug  = Debug('app');

import passport from 'passport';

import twitter  from 'passport-twitter';
import facebook from 'passport-facebook';
import google   from 'passport-google-oauth';

const Facebook = facebook.Strategy;
const Twitter = twitter.Strategy;
const Google = google.OAuth2Strategy;

function getListPowers() {
  const powers = {'droplist': []};
  for (const prop in Config.power) {
    if (Config.power.hasOwnProperty(prop) && Config.power[prop].active === true) {
      powers['droplist'].push({
        key: prop.toLowerCase(),
        value: Config.power[prop].default
      });
    }
  }
  return powers;
}

const data = {};
const options = {
  chat: true,
  dark: false,
  leaderboard: true,
  border: true,
  mass: false,
  move: true,
  round: true,
  powers: getListPowers()
};

const serverList = [];
const serverHash = {};
let ChangeLog = {};

let timer = setTimeout(function updateServerList() {
  const servers = [];
  for (const i in Config.servers) {
    const values = Config.servers[i].map(e => ({...e, region: i}));
    servers.push(...values);
  }
  serverList.length = 0;
  eachSeries(servers, (s, callback) => {
    request.get(`https://${s.ip}/stats`, {
      timeout: 2000
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let server;
        try {
          server = JSON.parse(body);
        } catch (e) {
          console.error(`${s.ip} wrong response on check users`);
        }
        if (server) {
          s.users = server.current_players;
          s.available = true;
          serverList.push(s);
        }
        callback();
      } else {
        s.available = false;
        serverList.push(s);
        callback();
      }
    });
  }, err => {
    if (err) {
      log.error(err);
      timer = setTimeout(updateServerList, 60000);
    } else {
      for (let i = 0; i < serverList.length; i++) {
        serverHash[serverList[i].hash] = {
          ip: serverList[i].ip
        };
      }
      timer = setTimeout(updateServerList, 60000);
    }
  });
}, 1000);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

changelog('CHANGELOG.md', (err, md) => {
  if (err) {
    log.error(err);
  } else {
    ChangeLog = {
      title: md.versions[1].title,
      body: markdown.toHTML(md.versions[1].body)
    };
  }
});

if (process.env.MAIN || process.env.NODE_ENV === 'development') {
  passport.use(new Facebook({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `https://${process.env.DOMAIN}/login/facebook/callback`
  }, (accessToken, refreshToken, profile, done) => {
    debug(profile);
    models
      .User
      .findOrCreate({
        where: {
          userId: profile.id
        },
        include: [ models.Setting ],
        defaults: {
          displayName: profile.displayName,
          provider: profile.provider
        }
      })
      .spread((user, created) => {
        debug(user.get({
          plain: true
        }));
        const opt = Object.assign({}, options);
        eachSeries(user.get({
          plain: true
        }).Settings, (option, callback) => {
          if (option.key === 'server') {
            if (serverHash[option.value]) {
              opt[option.key] = serverHash[option.value].ip;
            }
          } else {
            opt[option.key] = JSON.parse(option.value);
          }
          callback();
        }, err => {
          if (err) {
            log.error(err);
            rollbar.handleErrorWithPayloadData(err, {
              id: profile.id,
              name: profile.displayName,
              provider: profile.provider
            });
            done(err);
          } else {
            done(null, {
              userId: user.dataValues.userId,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              options: opt
            });
          }
        });
      });
  }));

  passport.use(new Twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_KEY_SECRET,
    callbackURL: `https://${process.env.DOMAIN}/login/twitter/callback`
  }, (token, tokenSecret, profile, done) => {
    debug(profile);
    models
      .User
      .findOrCreate({
        where: {
          userId: profile.id
        },
        include: [ models.Setting ],
        defaults: {
          displayName: profile.displayName,
          provider: profile.provider
        }
      })
      .spread((user, created) => {
        debug(user.get({
          plain: true
        }));
        const opt = Object.assign({}, options);
        eachSeries(user.get({
          plain: true
        }).Settings, (option, callback) => {
          if (option.key === 'server') {
            if (serverHash[option.value]) {
              opt[option.key] = serverHash[option.value].ip;
            }
          } else {
            opt[option.key] = JSON.parse(option.value);
          }
          callback();
        }, err => {
          if (err) {
            log.error(err);
            rollbar.handleErrorWithPayloadData(err, {
              id: profile.id,
              name: profile.displayName,
              provider: profile.provider
            });
            done(err);
          } else {
            done(null, {
              userId: user.dataValues.userId,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              options: opt
            });
          }
        });
      });
  }));

  passport.use(new Google({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://${process.env.DOMAIN}/login/google/callback`
  }, (token, tokenSecret, profile, done) => {
    debug(profile);
    models
      .User
      .findOrCreate({
        where: {
          userId: profile.id
        },
        include: [ models.Setting ],
        defaults: {
          displayName: profile.displayName,
          provider: profile.provider
        }
      })
      .spread((user, created) => {
        debug(user.get({
          plain: true
        }));
        const opt = Object.assign({}, options);
        eachSeries(user.get({
          plain: true
        }).Settings, (option, callback) => {
          if (option.key === 'server') {
            if (serverHash[option.value]) {
              opt[option.key] = serverHash[option.value].ip;
            }
          } else {
            opt[option.key] = JSON.parse(option.value);
          }
          callback();
        }, err => {
          if (err) {
            log.error(err);
            rollbar.handleErrorWithPayloadData(err, {
              id: profile.id,
              name: profile.displayName,
              provider: profile.provider
            });
            done(err);
          } else {
            done(null, {
              userId: user.dataValues.userId,
              username: user.dataValues.username,
              displayName: user.dataValues.displayName,
              options: opt
            });
          }
        });
      });
  }));

  router.route('/login/facebook').get(passport.authenticate('facebook'));
  router.route('/login/facebook/callback').get(passport.authenticate('facebook', {
    failureRedirect: '/'
  }), (req, res) => {
    res.redirect('/');
  });
  router.route('/login/google').get(passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }));
  router.route('/login/google/callback').get(passport.authenticate('google', {
    failureRedirect: '/'
  }), (req, res) => {
    res.redirect('/');
  });
  router.route('/login/twitter').get(passport.authenticate('twitter'));
  router.route('/login/twitter/callback').get(passport.authenticate('twitter', {
    failureRedirect: '/'
  }), (req, res) => {
    res.redirect('/');
  });

  router.route('/').get((req, res) => {
    data.files = require('../assets.json');
    if (data.files.main.js.length > 15) {
      data.hash = data.files.main.js.slice(5, -7);
    }
    data.production = (process.env.NODE_ENV === 'production');
    data.partials = {
      body: 'index'
    };
    data.currencies = [];
    data.groups = [];
    data.massBoost = [];
    data.xpBoost = [];
    data.account = {
      coins: 0,
      level: 1,
      nextLevel: Levels['2'].score - Levels['1'].score,
      progress: 0,
      score: 0
    };
    data.changelog = ChangeLog;
    const exist = req.user !== undefined;
    let userDB;
    models
      .Currency
      .findAll({
        where: {
          enabled: true
        }
      }).then((currencies) => {
        if (currencies) {
          currencies.forEach(currency => {
            const curr = JSON.parse(currency.get({
              plain: true
            }).json);
            data.currencies.push({
              id: curr.id,
              amount: curr.amount,
              price: curr.price,
              description: curr.description,
              recommend: (curr.advertisement_type === 'recommended'),
              bestdeal: (curr.advertisement_type === 'best_deal')
            });
          });
          data.currencies.sort((a, b) => { return b.price - a.price; });
          return models
            .Group
            .findAll({
              where: {
                parentId: 6079,
                enabled: true
              },
              include: [ models.Item ]
            });
        } else {
          return null;
        }
      }).then((groups) => {
        if (groups) {
          groups.forEach(group => {
            const grpJson = JSON.parse(group.get({
              plain: true
            }).json);
            data.groups.push({
              id: grpJson.id,
              name: grpJson.name,
              items: []
            });
            const itms = [];
            group.get({
              plain: true
            }).Items.forEach((item) => {
              const itmJson = JSON.parse(item.json);
              itms.push({
                idi: itmJson.id,
                name: itmJson.name,
                description: itmJson.description,
                level: (itmJson.groups[0] === 6081),
                code: itmJson.item_code,
                image: itmJson.image_url,
                price: itmJson.virtual_currency_price
              });
            });
            itms.sort((a, b) => {
              return a.price - b.price;
            });
            itms.forEach((item, i) => {
              const length = data.groups.length - 1;
              const itemsLng = data.groups[length].items.length - 1;
              if (i % 5 === 0) {
                data.groups[length].items.push({
                  fst: false,
                  page: itemsLng + 2,
                  itm: [{
                    idi: item.idi,
                    name: item.name,
                    description: item.description,
                    code: item.code,
                    level: item.level,
                    image: item.image,
                    price: item.price
                  }]
                });
              } else {
                data.groups[length].items[0].fst = true;
                data.groups[length].items[itemsLng].itm.push({
                  idi: item.idi,
                  name: item.name,
                  description: item.description,
                  code: item.code,
                  level: item.level,
                  image: item.image,
                  price: item.price
                });
              }
            });
          });
          if (data.groups.length > 0) {
            data.groups[0].first = true;
          }
          return models
            .Group
            .findOne({
              where: {
                groupId: 6129,
                enabled: true
              },
              include: [ models.Item ]
            });
        } else {
          return null;
        }
      }).then((group) => {
        if (group) {
          group.get({
            plain: true
          }).Items.forEach((item) => {
            const itmJson = JSON.parse(item.json);
            data.massBoost.push({
              idi: itmJson.id,
              name: itmJson.name,
              description: itmJson.description,
              image: itmJson.image_url,
              price: itmJson.virtual_currency_price,
              recommend: (itmJson.advertisement_type === 'recommended'),
              bestdeal: (itmJson.advertisement_type === 'best_deal')
            });
          });
          data.massBoost.sort((a, b) => {
            return a.price - b.price;
          });
          return models
            .Group
            .findOne({
              where: {
                groupId: 6130,
                enabled: true
              },
              include: [ models.Item ]
            });
        } else {
          return null;
        }
      }).then((group) => {
        if (group) {
          group.get({
            plain: true
          }).Items.forEach((item) => {
            const itmJson = JSON.parse(item.json);
            data.xpBoost.push({
              idi: itmJson.id,
              name: itmJson.name,
              description: itmJson.description,
              image: itmJson.image_url,
              price: itmJson.virtual_currency_price,
              recommend: (itmJson.advertisement_type === 'recommended'),
              bestdeal: (itmJson.advertisement_type === 'best_deal')
            });
          });
          data.xpBoost.sort((a, b) => {
            return a.price - b.price;
          });
        }
        return null;
      }).then(() => {
        if (exist) {
          return models.User.findOne({
            where: {
              userId: req.user.userId
            }
          });
        } else {
          return null;
        }
      }).then((user) => {
        if (exist && user) {
          userDB = user;
          req.user.userId = userDB.userId;
          req.user.dbId = userDB.id;
          req.user.username = userDB.username;
          req.user.displayName = userDB.displayName;
          return userDB.getSettings();
        } else {
          return null;
        }
      }).then((settings) => {
        if (exist) {
          if (settings && settings.length > 0) {
            settings.forEach((option) => {
              if (option.key === 'server') {
                if (serverHash[option.value]) {
                  req.user.options[option.key] = serverHash[option.value].ip;
                } else {
                  delete req.user.options[option.key];
                }
              } else {
                req.user.options[option.key] = JSON.parse(option.value);
              }
            });
          }
          data.user = req.user;
          if (req.session) {
            if (!req.session.powers) {
              req.session.powers = getListPowers();
            }
            data.powers = req.session.powers;
          } else {
            data.powers = getListPowers();
          }
          if (userDB) {
            return userDB.getAccounts();
          } else {
            return null;
          }
        } else {
          return null;
        }
      }).then((accounts) => {
        if (exist && accounts && accounts.length > 0) {
          accounts.forEach((account) => {
            if (account.key === 'score') {
              data.account.score = +account.value;
            }
            if (account.key === 'level') {
              data.account.level = +account.value;
            }
            if (account.key === 'coins') {
              data.account.coins = +account.value;
            }
            if (account.key === 'sprite') {
              data.account.sprite = sprite.frames[sprites[account.value].sprites['1']].frame;
              req.user.sprite = account.value;
            }
          });
          const levels = Object.keys(Levels);
          if (+data.account.level === +levels[levels.length - 1]) {
            data.account.progress = 0;
            data.account.nextLevel = 0;
          } else {
            const nextLevel = Levels[data.account.level + 1].score - Levels[data.account.level].score;
            data.account.progress = Math.round((data.account.score / nextLevel) * 100);
            data.account.nextLevel = nextLevel;
          }
        }
        return null;
      }).then(() => {
        if (exist && userDB) {
          return userDB.getItems();
        } else {
          return null;
        }
      }).then((items) => {
        if (items && items.length > 0) {
          const purchases = {};
          for (let i = 0; i < items.length; i++) {
            purchases[items[i].itemId] = {};
          }
          data.groups.push({
            id: 7777777,
            name: {
              en: 'Owned'
            },
            items: []
          });
          let i = 0;
          data.groups.forEach((group) => {
            if (group.id !== 7777777) {
              group.items.forEach((itms) => {
                itms.itm.forEach((item) => {
                  if (purchases[item.idi]) {
                    item.have = true;
                    const length = data.groups.length - 1;
                    const itemsLng = data.groups[length].items.length - 1;
                    if (i % 5 === 0) {
                      data.groups[length].items.push({
                        fst: false,
                        page: itemsLng + 2,
                        itm: [{
                          idi: item.idi,
                          name: item.name,
                          description: item.description,
                          level: item.level,
                          code: (item.code === req.user.sprite),
                          image: item.image,
                          price: item.price,
                          owned: true
                        }]
                      });
                    } else {
                      data.groups[length].items[0].fst = true;
                      data.groups[length].items[itemsLng].itm.push({
                        idi: item.idi,
                        name: item.name,
                        description: item.description,
                        level: item.level,
                        code: (item.code === req.user.sprite),
                        image: item.image,
                        price: item.price,
                        owned: true
                      });
                    }
                    i += 1;
                  } else {
                    if (item.level) {
                      item.unlocked = (data.account.level >= item.price);
                    }
                  }
                });
              });
            }
          });
          return null;
        } else if (items && items.length === 0) {
          data.groups.push({
            id: 7777777,
            name: {
              en: 'Owned'
            },
            items: []
          });
          data.groups.forEach((group) => {
            group.items.forEach((itms) => {
              itms.itm.forEach((item) => {
                if (item.level) {
                  item.unlocked = (data.account.level >= item.price);
                }
              });
            });
          });
          return null;
        } else {
          return null;
        }
      }).then(() => {
        if (exist && userDB) {
          if (!req.user.boost) {
            req.user.boost = {};
          }
          return userDB.getBoosts({
            where: {
              type: 'mass',
              end: {
                $gte: moment().utc().subtract(24, 'hours').format()
              }
            },
            order: [
              ['rate', 'DESC'],
              ['end', 'DESC'],
              ['time', 'DESC']
            ],
            limit: 1
          });
        } else {
          return null;
        }
      }).then((massBoost) => {
        if (massBoost && massBoost.length > 0) {
          const mass = massBoost[0].get({
            plain: true
          });
          if (mass.end > Date.now()) {
            req.user.boost[mass.type] = {
              rate: mass.rate,
              start: mass.createdAt,
              end: mass.end
            };
          }
        } else {
          if (exist && req.user.boost && req.user.boost.mass) {
            delete req.user.boost.mass;
          }
        }
        return null;
      }).then(() => {
        if (exist && userDB) {
          return userDB.getBoosts({
            where: {
              type: 'xp',
              end: {
                $gte: moment().utc().subtract(24, 'hours').format()
              }
            },
            order: [
              ['rate', 'DESC'],
              ['end', 'DESC'],
              ['time', 'DESC']
            ],
            limit: 1
          });
        } else {
          return null;
        }
      }).then((xpBoost) => {
        if (xpBoost && xpBoost.length > 0) {
          const xp = xpBoost[0].get({
            plain: true
          });
          if (xp.end > Date.now()) {
            req.user.boost[xp.type] = {
              rate: xp.rate,
              start: xp.createdAt,
              end: xp.end
            };
          }
        } else {
          if (exist && req.user.boost && req.user.boost.xp) {
            delete req.user.boost.xp;
          }
        }
        return null;
      }).then(() => {
        if (exist) {
          res.render('layout', data);
        } else {
          data.user = {
            options
          };
          if (req.session) {
            if (!req.session.powers) {
              req.session.powers = getListPowers();
            }
            data.powers = req.session.powers;
            if (req.session.username) {
              data.user.username = req.session.username;
            }
          } else {
            data.powers = getListPowers();
          }
          res.render('layout', data);
        }
        return null;
      }).catch(err => {
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
        data.user = {
          options
        };
        res.render('layout', data);
      });
  });

  router.route('/payment/currency/token').post((req, res) => {
    if (req.session.passport &&
        req.session.passport.user &&
        req.session.passport.user.userId) {
      models.Currency.findOne({
        where: {
          currencyId: req.body.id
        }
      }).then(currency => {
        if (currency) {
          request({
            uri: 'https://api.xsolla.com/merchant/merchants/32513/token',
            method: 'POST',
            auth: {
              user: process.env.XSOLLA_ID,
              pass: process.env.XSOLLA_KEY,
              sendImmediately: false
            },
            json: {
              user: {
                id: {
                  value: req.session.passport.user.userId,
                  hidden: true
                }
              },
              settings: {
                project_id: 20217,
                language: 'en'
              },
              purchase: {
                checkout: {
                  amount: currency.price,
                  currency: 'USD'
                }
              }
            }
          }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              res.send(body.token);
            } else {
              res.send('error');
              rollbar.handleError(error, req);
              log.error(`error: ${error}`);
            }
          });
        } else {
          res.send('error');
        }
      }).catch(err => {
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
      });
    } else {
      res.send('login');
    }
  });

  router.route('/payment/item').post((req, res) => {
    if (req.session.passport &&
        req.session.passport.user &&
        req.session.passport.user.userId) {
      let itemDB;
      let userDB;
      let money = false;
      let exist = false;
      models.Item.findOne({
        where: {
          itemId: req.body.id
        }
      }).then((item) => {
        if (item) {
          itemDB = item;
          return models.User.findOne({
            where: {
              userId: req.session.passport.user.userId
            }
          });
        } else {
          return null;
        }
      }).then((user) => {
        if (user) {
          userDB = user;
          return userDB.getItems({
            where: {
              itemId: req.body.id
            }
          });
        } else {
          return null;
        }
      }).then((item) => {
        if (item && item.length > 0) {
          exist = true;
          return null;
        } else {
          return true;
        }
      }).then((user) => {
        if (user) {
          return userDB.getAccounts({
            where: {
              key: 'coins'
            }
          });
        } else {
          return null;
        }
      }).then((coins) => {
        if (coins && coins.length > 0) {
          const item = JSON.parse(itemDB.get({
            plain: true
          }).json);
          if (coins[0].value >= item.virtual_currency_price) {
            return models.Account.update({
              value: +coins[0].value - +item.virtual_currency_price
            }, {
              where: {
                key: coins[0].key,
                UserId: coins[0].UserId
              }
            });
          } else {
            money = true;
            return null;
          }
        } else {
          return null;
        }
      }).then((update) => {
        if (update) {
          const user = userDB.get({
            plain: true
          });
          return itemDB.setUsers(user.id);
        } else {
          return null;
        }
      }).then((update) => {
        if (update) {
          res.send('sold');
        } else {
          if (exist) {
            res.send('exist');
          } else if (money) {
            res.send('money');
          } else {
            res.send('OK');
          }
        }
      }).catch(err => {
        res.send('error');
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
      });
    } else {
      res.send('login');
    }
  });

  router.route('/payment/coins').get((req, res) => {
    if (req.session.passport &&
        req.session.passport.user &&
        req.session.passport.user.userId) {
      models.User.findOne({
        where: {
          userId: req.session.passport.user.userId
        },
        include: [{
          model: models.Account,
          where: { key: 'coins' }
        }]
      }).then((user) => {
        if (user !== null && user.get({plain: true}).Accounts) {
          const coins = user.get({
            plain: true
          }).Accounts[0].value;
          res.send(coins);
        } else {
          res.send('error');
        }
      }).catch(err => {
        res.send('error');
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
      });
    } else {
      res.send('login');
    }
  });

  router.route('/payment/boost').post((req, res) => {
    if (req.session.passport &&
        req.session.passport.user &&
        req.session.passport.user.userId) {
      let itemDB;
      let userDB;
      let sold;
      let money = false;
      if (!req.user.boost) {
        req.user.boost = {};
      }
      models.Item.findOne({
        where: {
          itemId: req.body.id
        }
      }).then((item) => {
        if (item) {
          itemDB = item;
          return models.User.findOne({
            where: {
              userId: req.session.passport.user.userId
            }
          });
        } else {
          return null;
        }
      }).then((user) => {
        if (user) {
          userDB = user;
          return userDB.getAccounts({
            where: {
              key: 'coins'
            }
          });
        } else {
          return null;
        }
      }).then((coins) => {
        if (coins && coins.length > 0) {
          const item = JSON.parse(itemDB.get({
            plain: true
          }).json);
          if (coins[0].value >= item.virtual_currency_price) {
            return models.Account.update({
              value: +coins[0].value - +item.virtual_currency_price
            }, {
              where: {
                key: coins[0].key,
                UserId: coins[0].UserId
              }
            });
          } else {
            money = true;
            return null;
          }
        } else {
          return null;
        }
      }).then((update) => {
        if (update) {
          const user = userDB.get({
            plain: true
          });
          return itemDB.setUsers(user.id);
        } else {
          return null;
        }
      }).then((update) => {
        if (update) {
          const item = JSON.parse(itemDB.get({
            plain: true
          }).json);
          const boost = JSON.parse(item.item_code);
          return userDB.createBoost({
            boostId: item.id,
            type: boost.type,
            rate: boost.rate,
            time: boost.time,
            end: moment().utc().add(boost.time, 'hours').toDate()
          });
        } else {
          return null;
        }
      }).then((created) => {
        if (created) {
          sold = true;
        }
        return null;
      }).then(() => {
        if (userDB) {
          return userDB.getBoosts({
            where: {
              type: 'mass',
              end: {
                $gte: moment().utc().subtract(24, 'hours').format()
              }
            },
            order: [
              ['rate', 'DESC'],
              ['end', 'DESC'],
              ['time', 'DESC']
            ],
            limit: 1
          });
        } else {
          return null;
        }
      }).then((massBoost) => {
        if (massBoost && massBoost.length > 0) {
          const mass = massBoost[0].get({
            plain: true
          });
          if (mass.end > Date.now()) {
            req.user.boost[mass.type] = {
              rate: mass.rate,
              start: mass.createdAt,
              end: mass.end
            };
          }
        }
        return null;
      }).then(() => {
        if (userDB) {
          return userDB.getBoosts({
            where: {
              type: 'xp',
              end: {
                $gte: moment().utc().subtract(24, 'hours').format()
              }
            },
            order: [
              ['rate', 'DESC'],
              ['end', 'DESC'],
              ['time', 'DESC']
            ],
            limit: 1
          });
        } else {
          return null;
        }
      }).then((xpBoost) => {
        if (xpBoost && xpBoost.length > 0) {
          const xp = xpBoost[0].get({
            plain: true
          });
          if (xp.end > Date.now()) {
            req.user.boost[xp.type] = {
              rate: xp.rate,
              start: xp.createdAt,
              end: xp.end
            };
          }
        }
        return null;
      }).then(() => {
        if (sold) {
          res.send('sold');
        } else {
          if (money) {
            res.send('money');
          } else {
            res.send('OK');
          }
        }
      }).catch(err => {
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
        res.send('error');
      });
    } else {
      res.send('login');
    }
  });

  router.route('/redirect').get((req, res) => {
    if (req.user !== undefined) {
      models.User.findOne({
        where: {
          userId: req.query.user_id
        },
        include: [{
          model: models.Transaction,
          where: { transactionId: req.query.invoice_id }
        }]
      }).then((user) => {
        if (user !== null) {
          res.redirect('/#ok');
        } else {
          res.redirect('/#error');
        }
      }).catch(err => {
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
        res.status(500).send();
      });
    } else {
      res.redirect('/#guest');
    }
  });

  router.route('/webhook').post((req, res) => {
    if (req.headers.authorization) {
      const sha = crypto.createHash('sha1').update(JSON.stringify(req.body) + process.env.XSOLLA_SECRET).digest('hex');
      const auth = req.headers.authorization.slice(10, req.headers.authorization.length);
      if (auth === sha) {
        if (req.body.notification_type === 'user_validation') {
          models.User.findOne({
            where: {
              userId: req.body.user.id
            }
          }).then((user) => {
            if (user !== null) {
              user.createWebhook({
                type: 'user_validation',
                json: JSON.stringify(req.body)
              });
              res.status(204).send();
            } else {
              res.status(400).send();
            }
          }).catch(err => {
            res.status(500).send();
            log.error(`DB error: ${err}`);
          });
        } else if (req.body.notification_type === 'payment') {
          let exist = false;
          let amount = 0;
          let userDB;
          models.User.findOne({
            where: {
              userId: req.body.user.id
            }
          }).then((user) => {
            if (user !== null) {
              userDB = user;
              exist = true;
              return userDB.createWebhook({
                type: 'payment',
                json: JSON.stringify(req.body)
              });
            } else {
              return null;
            }
          }).then(() => {
            if (exist) {
              return models.Currency
                .findOne({
                  where: {
                    price: req.body.purchase.checkout.amount
                  }
                });
            } else {
              return null;
            }
          }).then((cur) => {
            if (exist && cur !== null) {
              amount = +JSON.parse(cur.get({
                plain: true
              }).json).amount;
              return userDB.getAccounts({
                where: {
                  key: 'coins'
                }
              });
            } else {
              return null;
            }
          }).then((account) => {
            if (exist && account !== null) {
              if (account.length > 0) {
                const coins = account[0].get({
                  plain: true
                });
                return models.Account.update({
                  value: +coins.value + amount
                }, {
                  where: {
                    key: coins.key,
                    UserId: coins.UserId
                  }
                });
              } else {
                return userDB.createAccount({
                  key: 'coins',
                  value: amount
                });
              }
            } else {
              return null;
            }
          }).then(() => {
            if (exist) {
              return userDB.createTransaction({
                transactionId: req.body.transaction.id,
                orderId: req.body.transaction.payment_method_order_id,
                date: req.body.transaction.payment_date
              });
            } else {
              return null;
            }
          }).then(() => {
            if (exist) {
              log.info('Webhook success');
              res.status(204).send();
            } else {
              log.info('Webhook error');
              res.status(400).send();
            }
          }).catch(err => {
            if (err.name !== 'SequelizeUniqueConstraintError') {
              log.error(`DB error: ${err}`);
              rollbar.handleError(err, req);
              res.status(500).send();
            } else {
              log.error(`DB error: ${err}`);
              res.status(204).send();
            }
          });
        } else {
          res.status(400).send();
        }
      } else {
        res.status(400).send();
      }
    } else {
      res.status(400).send();
    }
  });

  router.route('/logout').post((req, res) => {
    req.session.destroy();
    res.send('OK');
  });
} else {
  router.route('/').get((req, res) => {
    res.redirect('https://blobber.io');
  });
}

router.route('/settings').post((req, res) => {
  if (req.user !== undefined) {
    if (options.hasOwnProperty(req.body.option)) {
      models.Setting
        .findOrCreate({
          where: {
            key: req.body.option.toString(),
            UserId: req.user.dbId
          }, defaults: {
            value: (!JSON.parse(req.user.options[req.body.option])).toString()
          }
        }).spread((setting, created) => {
          if (created) {
            return null;
          } else {
            req.user.options[setting.key] = JSON.parse(setting.value);
            return models.Setting.update({
              value: (!JSON.parse(setting.value)).toString()
            }, {
              where: {
                key: setting.key,
                UserId: setting.UserId
              }
            });
          }
        }).then(() => {
          res.send('OK');
        }).catch(err => {
          if (err.name !== 'SequelizeUniqueConstraintError') {
            log.error(`DB error: ${err}`);
            rollbar.handleError(err, req);
            res.send('OK');
          } else {
            log.error(`DB error: ${err}`);
            res.send('OK');
          }
        });
    } else {
      res.send('OK');
    }
  } else {
    res.send('OK');
  }
});

router.route('/serverList').get((req, res) => {
  res.json(serverList);
});

router.route('/settings/server').post((req, res) => {
  if (req.user !== undefined) {
    models.Setting
      .findOrCreate({
        where: {
          key: 'server',
          UserId: req.user.dbId
        }, defaults: {
          value: req.body.option.toString()
        }
      }).spread((server, created) => {
        if (created) {
          return null;
        } else {
          return models.Setting.update({
            value: req.body.option.toString()
          }, {
            where: {
              key: server.key,
              UserId: server.UserId
            }
          });
        }
      }).then(() => {
        res.send('OK');
      }).catch(err => {
        if (err.name !== 'SequelizeUniqueConstraintError') {
          log.error(`DB error: ${err}`);
          rollbar.handleError(err, req);
          res.send('OK');
        } else {
          log.error(`DB error: ${err}`);
          res.send('OK');
        }
      });
  } else {
    res.send('OK');
  }
});

router.route('/settings/name').post((req, res) => {
  if (req.user !== undefined) {
    models.User.findOne({
      where: {
        userId: req.user.userId
      }
    }).then(user => {
      user.username = req.body.nick;
      req.user.username = user.username;
      return user.save();
    }).then(() => {
      res.send('OK');
    }).catch(err => {
      log.error(`DB error: ${err}`);
      rollbar.handleError(err, req);
      res.send('OK');
    });
  } else {
    if (req.session) {
      req.session.username = req.body.nick;
    }
    res.send('OK');
  }
});

router.route('/settings/sprite').post((req, res) => {
  if (req.user !== undefined) {
    let userDB;
    let itemDB;
    let accountDB;
    let level = 0;
    models.User.findOne({
      where: {
        userId: req.user.userId
      }
    }).then(user => {
      if (user) {
        userDB = user;
        return userDB.getAccounts({
          where: {
            key: 'level'
          }
        });
      } else {
        return null;
      }
    }).then((account) => {
      if (account && account.length > 0) {
        level = account[0].get({
          plain: true
        }).value;
      }
      return null;
    }).then(() => {
      if (userDB) {
        return userDB.getItems({
          where: {
            itemId: req.body.id
          }
        });
      } else {
        return null;
      }
    }).then((item) => {
      if (item && item.length > 0) {
        itemDB = JSON.parse(item[0].get({
          plain: true
        }).json);
      }
      return null;
    }).then(() => {
      if (userDB && !itemDB) {
        return models
          .Item
          .findOne({
            where: {
              itemId: req.body.id,
            },
            include: [{
              model: models.Group,
              where: {
                groupId: 6081,
                enabled: true
              }
            }]
          });
      } else {
        return null;
      }
    }).then((item) => {
      if (item) {
        const itm = JSON.parse(item.get({
          plain: true
        }).json);
        if (itm.virtual_currency_price <= level) {
          itemDB = itm;
        }
      }
      return null;
    }).then(() => {
      if (userDB && itemDB) {
        req.user.sprite = itemDB.item_code;
        return models.sequelize.transaction((t) => {
          return models.Account
            .findOrCreate({
              where: {
                key: 'sprite',
                UserId: userDB.get({plain: true}).id
              }, defaults: {
                value: itemDB.item_code
              }
            }).spread((account, created) => {
              if (!created) {
                accountDB = account.get({
                  plain: true
                });
              }
            });
        });
      } else {
        return null;
      }
    }).then(() => {
      if (accountDB) {
        return models.Account.update({
          value: itemDB.item_code
        }, {
          where: {
            key: accountDB.key,
            UserId: accountDB.UserId
          }
        });
      } else {
        return null;
      }
    }).then(() => {
      if (userDB) {
        if (itemDB) {
          res.send('changed');
        } else {
          res.send('notexist');
        }
      } else {
        res.send('user');
      }
    }).catch((err) => {
      if (err.name !== 'SequelizeUniqueConstraintError') {
        log.error(`DB error: ${err}`);
        rollbar.handleError(err, req);
        res.send('error');
      } else {
        log.error(`DB error: ${err}`);
        res.send('OK');
      }
    });
  } else {
    res.send('login');
  }
});

router.route('/settings/sprite').get((req, res) => {
  if (req.user && req.user.sprite) {
    res.send(sprite.frames[sprites[req.user.sprite].sprites['1']].frame);
  } else {
    res.send('OK');
  }
});

router.route('/session').get((req, res) => {
  if (req.sessionID) {
    res.send(req.sessionID);
  } else {
    res.send('OK');
  }
});

router.route('/stats').get((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  res.json(JSON.parse(objWithUsers.stats));
});

router.route('/changelog').get((req, res) => {
  fs.readFile('CHANGELOG.md', 'utf8', (err, md) => {
    if (err) {
      log.error(err);
    } else {
      res.status(200).send(markdown.toHTML(md));
    }
  });
});

export default router;
