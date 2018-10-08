const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const Inventory = require('./../models/inventory');

router.use(methodOverride('_method'));

// Chan: test middleware works????
router.use((req, res, next) => {
  console.log('Time', Date.now());
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'This is Amazon clone site, welcome!!!' });
});

// get inentory and display all
router.get('/inventory', (req, res, next) => {
  Inventory.find({}).then(inventory => {
    res.render('index', { inventory: inventory });
  });
});

// get inentory and display all
router.get('/inventory/seller', (req, res, next) => {
  Inventory.find({}).then(inventory => {
    res.render('inventory_seller', { inventory: inventory });
  });
});

// get login page************************Maryam
router.get('/login', function(req, res, next) {
  res.render('login');
});

//Search item by its name
router.post('/inventory/search', (req, res, next) => {
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
router.put('/inventory/:id', (req, res, next) => {
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
router.post('/inventory', (req, res) => {
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

router.get('/purchase/:id', (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    console.log(inventory);
    res.render('purchase', { inventory: inventory });
  });
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

router.get('/inventory/edit/:id', (req, res) => {
  Inventory.findOne({
    _id: req.params.id
  }).then(inventory => {
    res.render('inventory_update', { inventory: inventory });
  });
});

router.put('/inventory/update/:id', (req, res) => {
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

router.delete('/inventory/:id', (req, res) => {
  Inventory.remove({ _id: req.params.id }).then(() => {
    res.redirect('/inventory');
  });
});

// //The 404 Route (ALWAYS Keep this as the last route)
// router.get('*', function(req, res) {
//   res.send('what??? do not have such a route, 404');
// });

module.exports = router;
