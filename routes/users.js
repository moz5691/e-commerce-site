const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const User = require('./../models/user');

// const Joi = require('joi');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

// log in post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/inventory',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// register from POST
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({ text: 'passwords do not match' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password musth be at least 4 characters' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // dupliate email?
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        };
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw err;
            newUser.password = hash;
            User(newUser)
              .save()
              .then(user => {
                req.flash('success_msg', 'You are registered successfully!');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});
/*
router.put('/review/update/:id', (req, res) => {
  console.log('user review update');
  console.log(req.body);
  console.log(req.user);
  User.findOne({
    name:req.user.email
  }).then(user => {

  })

  res.send(req.body);
});


router.put('/purchase/:id', (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    qtyItem = req.body.qtyItem;
    res.locals.qtyItem = qtyItem;
    res.locals.totalCost = parseInt(qtyItem) * parseInt(inventory.itemPrice);
    // console.log(req.body);
    inventory.itemCount = parseInt(inventory.itemCount) - parseInt(qtyItem);
    inventory.itemSoldCount =
      parseInt(inventory.itemSoldCount) + parseInt(qtyItem);
    inventory.save().then(inventory => {
      res.render('purchase_complete', { inventory: inventory });
    });
  });
});

*/
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});

// const schema = Joi.object().keys({
//   username: Joi.string()
//     .email()
//     .required(),
//   password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
// });

// router.use((req, res, next) => {
//   if (req.query.msg === 'fail') {
//     res.locals.msg = 'Username Password not matched!';
//   } else {
//     res.locals.msg = '';
//   }
//   console.log('msg', res.locals.msg);
//   next();
// });

// router.get('/', (req, res, next) => {
//   res.send('user page...  TBD ');
// });

// router.get('/login', (req, res) => {
//   // console.log(req.query);
//   res.render('login');
// });

// router.post('/login_process', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   Joi.validate(
//     { username: username, password: password },
//     schema,
//     (err, value) => {
//       if (err) {
//         res.redirect('login?msg=fail');
//       } else {
//         if (password === 'xxxx') {
//           res.cookie('username', username);
//           res.redirect('welcome');
//         } else {
//           res.redirect('login?msg=fail');
//         }
//       }
//     }
//   );
// });

// /* Rendering welcome page, pass username via cookie */
// router.get('/welcome', (req, res, next) => {
//   res.render('welcome', {
//     username: req.cookies.username
//   });
// });

// /* Log out page, redirect to login page, clear cookie */
// router.get('/logout', (req, res, next) => {
//   res.clearCookie('username');
//   res.redirect('login');
// });

module.exports = router;
