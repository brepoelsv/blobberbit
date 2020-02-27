import express              from 'express';
import path                 from 'path';
import session              from 'express-session';
import logger               from 'morgan';
import favicon              from 'serve-favicon';
import bodyParser           from 'body-parser';
import passport             from 'passport';
import cons                 from 'consolidate';
import rollbar              from 'rollbar';
import webpack              from 'webpack';
import webpackMiddleware    from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import sessionConfig        from './session';
import config               from '../webpack.config';
import routes               from './routes/index';

rollbar.init(process.env.ROLLBAR_SERVER);
const isDeveloping = process.env.NODE_ENV !== 'production';
const app = express();
app.engine('tpl', cons.mustache);
app.set('view engine', 'tpl');
app.set('views', `${__dirname}/views`);
if (app.get('env') !== 'development') {
  app.enable('view cache');
} else {
  app.use(logger('dev'));
}
app.set('trust proxy', true);
app.use(bodyParser.json({
  limit: '20mb'
}));
app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: true
}));

if (isDeveloping) {
  app.use(logger('dev'));
  sessionConfig.cookie.secure = false;
  sessionConfig.cookie.maxAge = 31536000000;
  app.use(session(sessionConfig));
  app.use(favicon(`${__dirname}/../app/favicon.ico`));
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(favicon(`${__dirname}/../dist/app/favicon.ico`));
  app.use(session(sessionConfig));
  app.use('/', express.static(path.join(__dirname, '../dist'), {
    maxage: '7d'
  }));
}

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

if (process.env.NODE_ENV === 'production') {
  app.use(rollbar.errorHandler(process.env.ROLLBAR_SERVER));
}

export default app;
