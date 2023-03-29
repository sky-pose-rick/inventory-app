const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price_dollars: { type: Number, required: true, min: 0 },
  price_cents: {
    type: Number, required: true, min: 0, max: 99,
  },
  number_in_stock: { type: Number, required: true, min: 0 },
});

ItemSchema.virtual('price').get(function () {
  if (this.price_cents < 10) { return `$${this.price_dollars}.0${this.price_cents}`; }
  return `$${this.price_dollars}.${this.price_cents}`;
});

ItemSchema.virtual('url').get(function () {
  return `/inventory/category/${this._id}`;
});

ItemSchema.virtual('image_path').get(function () {
  return `/images/items/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
