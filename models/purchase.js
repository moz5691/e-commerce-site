const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PurchaseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  cart: { type: Object, required: true }
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);
module.exports = Purchase;
