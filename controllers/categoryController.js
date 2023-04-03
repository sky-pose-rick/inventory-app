const Category = require('../models/category');
const Item = require('../models/item');

// index
exports.index = (req, res, next) => {
  res.redirect('/inventory/categories');
};

// all categories
exports.category_list = (req, res, next) => {
  Category.find()
    .sort([['name', 'ascending']])
    .exec()
    .then((categoryList) => {
      res.render('category_list', {
        title: 'Departments',
        category_list: categoryList,
      });
    })
    .catch((err) => next(err));
};

// specific category
exports.category_detail = (req, res, next) => {
  // find category
  Category.findOne({ _id: req.params.id })
    .then((category) => {
      res.render('category_detail', {
        title: `${category.name}: Details`,
        category,
      });
    })
    .catch((err) => next(err));
};

// display form to create category
exports.category_create_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle category create form
exports.category_create_post = (req, res, next) => {
  res.send('Not implemented');
};

// display category delete form
exports.category_delete_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle category delete form
exports.category_delete_post = (req, res, next) => {
  res.send('Not implemented');
};

// display category update form
exports.category_update_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle category update form
exports.category_update_post = (req, res, next) => {
  res.send('Not implemented');
};
