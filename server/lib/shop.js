import Cron       from 'cron';
import request    from 'request';
import eachSeries from 'async/eachSeries';
import rollbar    from 'rollbar';
import models     from '../models/index';
import log        from './logs.js';

rollbar.init(process.env.ROLLBAR_SERVER);

const CronJob = Cron.CronJob;

function updateItems() {
  request('https://api.xsolla.com/merchant/projects/20217/virtual_items/items', {
    'auth': {
      'user': process.env.XSOLLA_ID,
      'pass': process.env.XSOLLA_KEY,
      'sendImmediately': false
    }
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const jsonb = JSON.parse(body);
      eachSeries(jsonb, (items, callback) => {
        request(`https://api.xsolla.com/merchant/projects/20217/virtual_items/items/${items.id}`, {
          'auth': {
            'user': process.env.XSOLLA_ID,
            'pass': process.env.XSOLLA_KEY,
            'sendImmediately': false
          }
        }, (err, resp, itemBody) => {
          if (!err && resp.statusCode === 200) {
            const itemJson = JSON.parse(itemBody);
            models.Item.findOne({
              where: {
                itemId: itemJson.id
              }
            }).then(item => {
              if (item !== null) {
                item.json = JSON.stringify(itemJson);
                item.enabled = itemJson.enabled;
                return item.save();
              }
              return models.Item.create({
                itemId: itemJson.id,
                json: JSON.stringify(itemJson),
                enabled: itemJson.enabled
              });
            }).then((item) => {
              item.setGroups(itemJson.groups);
              callback();
            }).catch(e => {
              log.error(e);
              rollbar.handleError(e);
              callback();
            });
          } else {
            log.error(`error: ${err}`);
            rollbar.handleError(err);
            callback();
          }
        });
      }, errAsync => {
        if (errAsync) {
          log.error(errAsync);
          rollbar.handleError(errAsync);
        }
      });
    } else {
      log.error(`error: ${error}`);
      rollbar.handleError(error);
    }
  });
}

const updateCurrencies = new CronJob({
  cronTime: '0 0 0 * * *',
  onTick: () => {
    request('https://api.xsolla.com/merchant/projects/20217/virtual_currency', {
      'auth': {
        'user': process.env.XSOLLA_ID,
        'pass': process.env.XSOLLA_KEY,
        'sendImmediately': false
      }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const json = JSON.parse(body);
        eachSeries(json.packets[json['default_currency']], (currency, callback) => {
          models
            .Currency
            .upsert({
              currencyId: currency.id,
              json: JSON.stringify(currency),
              price: currency.price,
              enabled: currency.enabled
            }).then((created) => {
              callback();
            }).catch(err => {
              log.error(err);
              rollbar.handleError(err);
              callback();
            });
        }, err => {
          if (err) {
            log.error(err);
            rollbar.handleError(err);
          }
          return null;
        });
      } else {
        log.error(`error: ${error}`);
        rollbar.handleError(error);
      }
    });
  },
  runOnInit: false
});

const updateGroups = new CronJob({
  cronTime: '0 10 0 * * *',
  onTick: () => {
    request('https://api.xsolla.com/merchant/projects/20217/virtual_items/groups', {
      'auth': {
        'user': process.env.XSOLLA_ID,
        'pass': process.env.XSOLLA_KEY,
        'sendImmediately': false
      }
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const json = JSON.parse(body);
        eachSeries(json, (group, callback) => {
          request(`https://api.xsolla.com/merchant/projects/20217/virtual_items/groups/${group.id}`, {
            'auth': {
              'user': process.env.XSOLLA_ID,
              'pass': process.env.XSOLLA_KEY,
              'sendImmediately': false
            }
          }, (err, res, b) => {
            if (!err && res.statusCode === 200) {
              const groupJson = JSON.parse(b);
              models
                .Group
                .upsert({
                  groupId: groupJson.id,
                  parentId: groupJson.parent_id,
                  json: JSON.stringify(groupJson),
                  has_groups: group.has_groups,
                  has_virtual_items: group.has_virtual_items,
                  enabled: groupJson.enabled
                }).then((created) => {
                  callback();
                }).catch(e => {
                  log.error(e);
                  rollbar.handleError(e);
                  callback();
                });
            } else {
              log.error(`error: ${err}`);
              rollbar.handleError(err);
            }
          });
        }, err => {
          if (err) {
            log.error(err);
            rollbar.handleError(err);
          } else {
            updateItems();
          }
        });
      } else {
        log.error(`error: ${error}`);
        rollbar.handleError(error);
      }
    });
  },
  runOnInit: false
});

if (process.env.XSOLLA_ID &&
    process.env.XSOLLA_KEY &&
    process.env.MAIN &&
    process.env.NODE_ENV === 'production') {
  updateCurrencies.start();
  updateGroups.start();
}
