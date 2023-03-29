#!/usr/bin/env node

console.log('Populate the db with samples. Specify database connection string as an argument');

const userArgs = process.argv.slice(2);

const async = require('async');
const mongoose = require('mongoose');
const Category = require('./models/category');
const Item = require('./models/item');

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const items = [];
const categories = [];

function createItem(name, desc, category, price_dollars, price_cents, count, image, cb) {
  // required fields
  const itemDetails = {
    name,
    description: desc,
    category,
    price_dollars,
    price_cents,
    number_in_stock: count,
  };
  // optional fields
  if (image) itemDetails.image_path = image;

  const newItem = new Item(itemDetails);

  newItem.save()
    .then(() => {
      console.log('New Item: ', newItem);
      items.push(newItem);
      if (cb) cb(null, newItem);
    })
    .catch((err) => {
      if (cb) { cb(err); }
    });
}

function createCategory(name, description, image, cb) {
  // required fields
  const categoryDetails = { name, description };
  // optional fields
  if (image) categoryDetails.image_path = image;

  const newCategory = new Category(categoryDetails);

  newCategory.save()
    .then(() => {
      console.log('New Category: ', newCategory);
      categories.push(newCategory);
      if (cb) cb(null, newCategory);
    })
    .catch((err) => {
      if (cb) { cb(err); }
    });
}

function createCategories(cb) {
  // create in series because the order matters
  async.series([
    function (callback) {
      createCategory('Food', 'What you can eat', null, callback);
    },
    function (callback) {
      createCategory('Automotive', 'What you can drive', null, callback);
    },
    function (callback) {
      createCategory('Food Trucks', 'Where you can eat and drive', null, callback);
    },
  ], cb);
}

function createItems(cb) {
  // create in parallel because order doesn't matter
  async.parallel([
    function (callback) {
      createItem(
        'Air',
        'Breathe it in',
        categories[0],
        0,
        0,
        Number.MAX_SAFE_INTEGER,
        null,
        callback,
      );
    },
    function (callback) {
      createItem(
        'Cookie',
        'The only thing here that is edible',
        categories[0],
        1,
        25,
        12,
        null,
        callback,
      );
    },
    function (callback) {
      createItem(
        'Bicycle',
        'You can ring the bell',
        categories[1],
        300,
        97,
        2,
        null,
        callback,
      );
    },
    function (callback) {
      createItem(
        'Bicycle with a Picnic Basket',
        'What\'s in the box? Is it a cookie?',
        categories[2],
        325,
        99,
        1,
        null,
        callback,
      );
    },
  ], cb);
}

// create categories before items
async.series([
  createCategories,
  createItems,
], (err, results) => {
  if (err) { console.error('Final error: ', err); } else { console.log('Successfully filled db'); }

  mongoose.connection.close();
});
