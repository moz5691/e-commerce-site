const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InventorySchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  itemDepartment: {
    type: String,
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  },
  itemSeller: {
    type: String,
    required: true
  },
  itemCount: {
    type: Number,
    required: true
  },
  itemImgPath: {
    type: String,
    required: false
  },
  itemTag: [
    {
      type: String,
      required: false
    }
  ]
});

const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;
