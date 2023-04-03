const { body, validationResult } = require('express-validator');
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
  // find item
  Item.findOne({ _id: req.params.id })
    .populate('category')
    .exec()
    .then((item) => {
      res.render('item_detail', {
        title: `${item.name}: Details`,
        item,
      });
    })
    .catch((err) => next(err));
};

// display form to create item
exports.item_create_get = (req, res, next) => {
  if (req.params.id) {
    Category.find()
      .then((categories) => {
        res.render('item_form', {
          title: 'Create Item',
          category: req.params.id,
          categories,
        });
      })
      .catch((err) => next(err));
  } else { // display all categories as options
    Category.find()
      .then((categories) => {
        res.render('item_form', {
          title: 'Create Item',
          categories,
        });
      })
      .catch((err) => next(err));
  }
};

// handle item create form
exports.item_create_post = [ // an array of validators and functions
  // validate and sanitize fields
  body('name', 'Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('category', 'Category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isDecimal({ decimal_digits: 2 })
    .withMessage('Price be a decimal number.')
    .isFloat({ min: 0 })
    .withMessage('Price must be not be negative.'),
  body('number_in_stock', 'Number in stock must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isInt({ min: 0 })
    .withMessage('Number in stock must not be negative.'),
  // TODO: image and password for image
  (req, res, next) => {
    const errors = validationResult(req);
    const priceCents = req.body.price * 100;

    // use the escaped/trimmed data
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price_cents: priceCents,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // has errors, re-render required
      // display all categories as options
      Category.find()
        .then((categories) => {
          res.render('item_form', {
            title: 'Create Item',
            categories,
            item,
            errors: errors.array(),
          });
        })
        .catch((err) => next(err));
    }

    // data validated
    item.save()
      .then(() => res.redirect(item.url))
      .catch((err) => next(err));
  },
];

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
