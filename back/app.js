var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// BIBLIOTECAS DE AUTENTICAÇÃO
var rateLimit = require('express-rate-limit');
var session = require('express-session');

var app = express();
app.use(express.json());
 
//CONFIGURAÇÃO DE LIMITES DE REQUISIÇÕES
const limiter = rateLimit({
  windowsMs: 15 * 60 * 1000,
  max: 100 
});

app.use('/login', limiter);

session_config = session({
  secret: '881fca48c92a98295aaaeee18c6f1425d00f59298f0b085a01c51cb2329d4cb2',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})

//CONFIGURAÇÃO DE SESSAO
app.use(session_config);

//IMPORT DAS ROTAS /ROUTES...
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

const { error } = require('console');

//DEFINE OS ENDPOINTS PARA AS ROTAS
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({error:'Not found'});
});

module.exports = app;
