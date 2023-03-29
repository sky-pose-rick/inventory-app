const mongoose = require('mongoose');

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true },
});

CategorySchema.virtual('detail_url').get(function () {
  return `/inventory/category/${this._id}`;
});

CategorySchema.virtual('item_list_url').get(function () {
  return `/inventory/category/${this._id}/items`;
});

CategorySchema.virtual('image_path').get(function () {
  return `/images/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
