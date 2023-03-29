const Category = require('../models/category');
const Item = require('../models/item');

// items in category
exports.item_list = (req, res, next) => {
  // find category
  Category.findOne({ _id: req.params.id })
    .then((category) => {
    // now find items
      Item.find({ category })
        .sort([['name', 'ascending']])
        .exec()
        .then((itemList) => {
          res.render('item_list', {
            title: `${category.name} Items`,
            category,
            item_list: itemList,
          });
        })
        .catch((err) => next(err));
    })
    .catch(((err) => next(err)));
};

// specific item
exports.item_detail = (req, res, next) => {
  res.send('Not implemented');
};

// display form to create item
exports.item_create_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle item create form
exports.item_create_post = (req, res, next) => {
  res.send('Not implemented');
};

// display item delete form
exports.item_delete_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle item delete form
exports.item_delete_post = (req, res, next) => {
  res.send('Not implemented');
};

// display item update form
exports.item_update_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle item update form
exports.item_update_post = (req, res, next) => {
  res.send('Not implemented');
};
