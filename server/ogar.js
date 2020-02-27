import GameServer from './ogar/GameServer';
import http       from './lib/http';
import io         from './lib/io';

export default () => {
  const gameServer = new GameServer(io);
  gameServer.start();
  return http;
};
