const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const routes = require('./routes');

module.exports = (db) => {
  const app = express();

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(compress());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));


  // Passport Configuration
  app.use(session({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(passport.authenticate('remember-me'));
  app.use(flash());

  require('./passport/config.js')(passport); // eslint-disable-line global-require

  app.use('/backendServices', routes(db, passport));
  app.get('*', (req, res) => { res.sendFile(`${__dirname}/public/index.html`); });
  app.use('/public', express.static(`${__dirname}/public`));

  // // catch 404 and forward to error handler
  // app.use(function(req, res, next) {
  //   const err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });
  //
  // // error handlers
  //
  // // development error handler
  // // will print stacktrace
  // if (app.get('env') === 'development') {
  //   app.use(function(err, req, res, next) {
  //     res.status(err.status || 500);
  //     res.render('error', {
  //       message: err.message,
  //       error: err
  //     });
  //   });
  // }
  //
  // // production error handler
  // // no stacktraces leaked to user
  // app.use(function(err, req, res, next) {
  //   res.status(err.status || 500);
  //   res.render('error', {
  //     message: err.message,
  //     error: {}
  //   });
  // });

  return app;
};
