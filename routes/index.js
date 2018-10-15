const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');

const { ensureAuthenticated } = require('../helpers/auth');

router.use((req, res, next) => {
  console.log('Time', Date.now());
  next();
});

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', { title: 'This week special!' });
});

// get inentory and display all
router.get('/inventory', ensureAuthenticated, (req, res, next) => {
  Inventory.find({}).then(inventory => {
    res.render('index', { inventory: inventory });
  });
});

// get inentory and display all
router.get('/inventory/seller', ensureAuthenticated, (req, res, next) => {
  Inventory.find({}).then(inventory => {
    res.render('inventory_seller', { inventory: inventory });
  });
});

//Search item by its name
router.post('/inventory/search', ensureAuthenticated, (req, res, next) => {
  const searchItem = req.body.searchItem;
  Inventory.find({ itemName: searchItem }, (err, inventory) => {
    if (err) {
      return res.status(200).send(err);
    } else {
      res.render('index', { inventory: inventory });
      //res.json(inventory);
    }
  });
});

// update inventory count
router.put('/inventory/:id', ensureAuthenticated, (req, res, next) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    inventory.itemCount = req.body.itemCount;
    inventory.save().then(inventory => {
      res.json(inventory);
    });
  });
});
// post inventory
router.post('/inventory', ensureAuthenticated, (req, res) => {
  const newInventory = {
    itemName: req.body.itemName,
    itemDepartment: req.body.itemDepartment,
    itemPrice: req.body.itemPrice,
    itemDescription: req.body.itemDescription,
    itemSeller: req.body.itemSeller,
    itemCount: req.body.itemCount,
    itemImgPath: req.body.itemImgPath
  };
  new Inventory(newInventory)
    .save()
    .then(inventory => res.redirect('/inventory'));
});

router.get('/inventory/edit/:id', ensureAuthenticated, (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    res.render('inventory_update', { inventory: inventory });
  });
});

router.put('/inventory/update/:id', ensureAuthenticated, (req, res) => {
  console.log('inventory update');
  console.log(req.body);
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    req.body.itemName
      ? (inventory.itemName = req.body.itemName)
      : (inventory.itemName = inventory.itemName);
    req.body.itemSeller
      ? (inventory.itemDescription = req.body.itemDescription)
      : (inventory.itemDescription = inventory.itemDescription);
    req.body.itemSeller
      ? (inventory.itemSeller = req.body.itemSeller)
      : (inventory.itemSeller = inventory.itemSeller);
    req.body.itemPrice
      ? (inventory.itemPrice = req.body.itemPrice)
      : (inventory.itemPrice = inventory.itemPrice);
    req.body.itemCount
      ? (inventory.itemCount = req.body.itemCount)
      : (inventory.itemCount = inventory.itemCount);
    req.body.itemImgPath
      ? (inventory.itemImgPath = req.body.itemImgPath)
      : (inventory.itemImgPath = inventory.itemImgPath);
    inventory.save().then(inventory => {
      res.redirect('/inventory/seller');
    });
  });
});

router.get('/review/:id', ensureAuthenticated, (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    console.log(inventory);
    res.render('review/user_review', { inventory: inventory });
  });
});

router.put('/review/update/:id', ensureAuthenticated, (req, res) => {
  console.log('user review update');
  console.log(req.body);
  console.log(req.user);
  const review = {
    reviewer: req.user.email,
    rate: req.body.userRate,
    content: req.body.userReview,
    date: Date.now()
  };
  Inventory.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { itemReview: review } },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        res.redirect('/inventory');
      }
    }
  );
});

router.delete('/inventory/:id', ensureAuthenticated, (req, res) => {
  Inventory.remove({ _id: req.params.id }).then(() => {
    res.redirect('/inventory');
  });
});

module.exports = router;
