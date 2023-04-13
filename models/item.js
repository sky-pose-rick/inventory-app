const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price_cents: {
    type: Number, required: true, min: 0,
  },
  number_in_stock: { type: Number, required: true, min: 0 },
  image_path: { type: String },
});

ItemSchema.virtual('price').get(function () {
  const price = (this.price_cents / 100).toFixed(2);
  return `$${price}`;
});

ItemSchema.virtual('url').get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
