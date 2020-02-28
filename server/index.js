import Debug  from 'debug';
import app    from './app';
import models from './models/index';
// import Game   from './game';
import Ogar   from './ogar';
import './lib/shop';

const debug = Debug('app');

const http = process.env.MAIN ? app : Ogar();

const ipaddress = process.env.IP || '127.0.0.1';
const serverport = process.env.PORT || '3000';
models.sequelize.sync().then(() => {
  http.listen(serverport, ipaddress, () => {
    debug(`[DEBUG] Listening on ${ipaddress}:${serverport}`);
  });
});
