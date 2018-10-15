const express = require('express');
const router = express.Router();

const Purchase = require('../models/purchase');
const Inventory = require('../models/inventory');
const Cart = require('../models/cart');
const { ensureAuthenticated } = require('../helpers/auth');

router.use((req, res, next) => {
  if (req.query._method == 'PUT') {
    req.method = 'PUT';
    req.url = req.path;
  }
  next();
});

router.get('/cart', (req, res) => {
  if (!req.session.cart) {
    return res.render('purchase_cart', { items: null });
  }
  let cart = new Cart(req.session.cart);
  console.log('req.user.id', req.user.id);
  Purchase.find({ user: req.user.id }).then(purchase => {
    console.log('purchas history', purchase);

    res.render('purchase_cart', {
      items: cart.generateArray(),
      totalQty: cart.totalQty,
      totalPrice: cart.totalPrice,
      purchase: purchase
    });
  });
});
router.post('/add-cart/:id', (req, res) => {
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  qtyItem = parseInt(req.body.qtyItem);
  console.log(qtyItem);
  Inventory.findById({ _id: req.params.id }).then(inventory => {
    cart.add(inventory, qtyItem, inventory.id);
    req.session.cart = cart;
    // console.log(cart);
    res.redirect('/purchase/cart');
    // res.send(cart);
  });
});

router.get(
  '/checkout',
  (req, res) => {
    if (!req.session.cart) {
      return res.redirect('/purchase/cart');
    }
    const cart = req.session.cart;
    let idArray = Object.keys(cart.items);
    // console.log('idArray', idArray);
    // for (let i = 0; i < idArray.length; i++) {
    //   console.log(cart.items[idArray[i]].qty);
    // }

    for (let i = 0; i < idArray.length; i++) {
      let qtyItem = cart.items[idArray[i]].qty;
      Inventory.findOne({ _id: idArray[i] }).then(inventory => {
        inventory.itemCount = parseInt(inventory.itemCount) - parseInt(qtyItem);
        inventory.itemSoldCount =
          parseInt(inventory.itemSoldCount) + parseInt(qtyItem);
        inventory.save().then(err => {
          if (err) {
            return err;
          }
        });
      });
    }
    const purchase = new Purchase({
      user: req.user.id,
      cart: cart
    });
    console.log('user', req.user);
    console.log('cart', cart);
    purchase.save((err, result) => {
      if (err) {
        return err;
      }
      console.log('saved purchase');
      req.flash('success', 'Successfully charged');
      req.session.cart = null;
      res.redirect('/inventory');
    });
  }
  // Inventory.find({
  //   _id: idArray
  // }).then(inventory => {
  //   let i = 0;
  //   inventory.forEach(el => {
  //     let qtyItem = cart.items[idArray[i]].qty;
  //     el.itemCount = parseInt(el.itemCount) - parseInt(qtyItem);
  //     el.itemSoldCount = parseInt(el.itemSoldCount) + parseInt(qtyItem);
  //     i++;
  //   });
  //   inventory.save().then(res.redirect('/inventory'));
  // });
);

router.get('/:id', ensureAuthenticated, (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    console.log(inventory);
    res.render('purchase', { inventory: inventory });
  });
});
/*
router.put('/purchase/:id', ensureAuthenticated, (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    qtyItem = req.body.qtyItem;
    res.locals.qtyItem = qtyItem;
    res.locals.totalCost = parseInt(qtyItem) * parseInt(inventory.itemPrice);
    inventory.itemCount = parseInt(inventory.itemCount) - parseInt(qtyItem);
    inventory.itemSoldCount =
      parseInt(inventory.itemSoldCount) + parseInt(qtyItem);
    inventory.save().then(inventory => {
      res.render('purchase_complete', { inventory: inventory });
    });
  });
});
*/

module.exports = router;
