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
  itemSoldCount: {
    type: Number,
    default: 0,
    required: false
  },
  itemImgPath: {
    type: String,
    required: false
  },
  itemReview: [
    {
      reviewer: String,
      rate: Number,
      content: String,
      date: Date
    }
  ],
  itemTag: [
    {
      type: String,
      required: false
    }
  ]
});

const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;
