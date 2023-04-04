const { body, validationResult } = require('express-validator');
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
  res.render('category_form', {
    title: 'Create Category',
  });
};

// handle category create form
exports.category_create_post = [
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // has errors
      res.render('category_form', {
        title: 'Create Category',
        category,
        errors: errors.array(),
      });
    }
    // check if category already exists
    Category.findOne({ name: req.body.name })
      .then((existingCategory) => {
        if (existingCategory) {
          res.redirect(existingCategory.detail_url);
          return;
        }
        // data valid and not a duplicate
        category.save()
          .then(() => res.redirect(category.detail_url))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  },
];

// display category delete form
exports.category_delete_get = (req, res, next) => {
  Category.findById(req.params.id)
    .then((category) => {
      Item.find({ category: category._id })
        .then((items) => {
          res.render('category_delete', {
            title: 'Delete Item',
            category,
            items,
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

// handle category delete form
exports.category_delete_post = (req, res, next) => {
  Item.find({ category: req.params.id })
    .then((items) => {
      if (items.length > 0) {
        // all items not yet deleted
        Category.findById(req.params.id)
          .then((category) => {
            res.render('category_delete', {
              title: 'Delete Item',
              category,
              items,
            });
          })
          .catch((err) => next(err));
        return;
      }
      Category.findByIdAndDelete(req.params.id)
        .then(() => {
          res.redirect('/inventory');
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

// display category update form
exports.category_update_get = (req, res, next) => {
  res.send('Not implemented');
};

// handle category update form
exports.category_update_post = (req, res, next) => {
  res.send('Not implemented');
};
