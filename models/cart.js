module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, qty, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = {
        item: item,
        qty: 0,
        price: 0,
        name: item.itemName,
        price: item.itemPrice,
        sku: item._id
      };
    }
    storedItem.qty += qty;
    storedItem.price = storedItem.item.itemPrice * storedItem.qty;
    this.totalQty += qty;
    this.totalPrice += storedItem.item.itemPrice * storedItem.qty;
  };

  this.reduceByOne = function(id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };

  this.removeItem = function(id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.generateArray = function() {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    console.log(arr);
    return arr;
  };
};