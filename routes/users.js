var express = require('express');
var router = express.Router();
const Joi = require('joi');
const schema = Joi.object().keys({
  username: Joi.string()
    .email()
    .required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('user page...  TBD ');
});

/* GET login page rendering */
router.get('/login', (req, res) => {
  res.render('login');
});

/* log in process. check username and password validation. */
router.post('/login_process', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  Joi.validate(
    { username: username, password: password },
    schema,
    (err, value) => {
      if (err) {
        // res.status(422).json({
        //   status: 'error',
        //   message: 'invalid username/password',
        //   data: userData
        // });
        redirect('login?msg=fail');
      } else {
        if (password === 'xxxx') {
          res.cookie('username', username);
          res.redirect('welcome');
        } else {
          res.redirect('login?msg=fail');
        }
      }
    }
  );
});

/* Rendering welcome page, pass username via cookie */
router.get('/welcome', (req, res, next) => {
  res.render('welcome', {
    username: req.cookies.username
  });
});

/* Log out page, redirect to login page, clear cookie */
router.get('/logout', (req, res, next) => {
  res.clearCookie('username');
  res.redirect('login');
});

module.exports = router;
