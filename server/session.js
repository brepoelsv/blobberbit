import session from 'express-session';
import Redis   from 'connect-redis';

const RedisStore = Redis(session);

export default {
  store: new RedisStore({
    host: process.env.REDIS,
    port: 6379,
    pass: ''
  }),
  secret: process.env.SECRET,
  proxy: true,
  cookie: {
    domain: `.${process.env.DOMAIN}`,
    httpOnly: true,
    secure: true,
    maxAge: null
  },
  resave: false,
  saveUninitialized: true
};
