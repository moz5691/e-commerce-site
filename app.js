const createError = require('http-errors');
const express = require('express');
const path = require('path');
const { mongoose } = require('./db/mongoose');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const helmet = require('helmet');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');

var app = express();
app.use(helmet());
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const purchaseRouter = require('./routes/purchase');

require('./config/passport')(passport);
/**
 * middleware set up.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// load all partials -- e.g. navbar
hbs.registerPartials(__dirname + '/views/partial');
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false
  })
);
// initialize session
app.use(flash());
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/purchase', purchaseRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
