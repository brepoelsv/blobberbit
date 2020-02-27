import WebSocket from 'ws';
import http from './http';

const io = new (WebSocket.Server)({
  server: http,
  perMessageDeflate: false,
  maxPayload: 4096
});

export default io;
