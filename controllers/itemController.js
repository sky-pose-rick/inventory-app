const { body, validationResult } = require('express-validator');
const multer = require('multer');
const { authorizationValidator, fileValidator, makeFileFilter } = require('../helpers/extraValidators');

const Category = require('../models/category');
const Item = require('../models/item');

const itemFormValidators = [
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
];

const upload = multer({
  dest: './public/data/uploads',
  fileFilter: makeFileFilter('file_password'),
});

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
      if (item == null) {
        const notFound = new Error('Item not found');
        notFound.status = 404;
        return next(notFound);
      }

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
exports.item_create_post = [
  // upload file before checkig validators
  upload.single('uploaded_file'),
  // an array of validators and functions
  // validate and sanitize fields
  [...itemFormValidators],
  fileValidator,
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
      image_path: (req.file) ? req.file.filename : 'none',
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
      .then((newItem) => res.redirect(newItem.url))
      .catch((err) => next(err));
  },
];

// display item delete form
exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id)
    .then((item) => {
      res.render('item_delete', {
        title: 'Delete Item',
        item,
      });
    })
    .catch((err) => next(err));
};

// handle item delete form
exports.item_delete_post = [
  authorizationValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Item.findById(req.params.id)
        .then((item) => {
          res.render('item_delete', {
            title: 'Delete Item',
            item,
            errors: errors.array(),
          });
        })
        .catch((err) => next(err));
      return;
    }
    Item.findByIdAndDelete(req.params.id)
      .then(() => res.redirect('/inventory'))
      .catch((err) => next(err));
  }];

// display item update form
exports.item_update_get = (req, res, next) => {
  Item.findById(req.params.id)
    .then((item) => {
      if (item == null) {
        const notFound = new Error('Item not found');
        notFound.status = 404;
        return next(notFound);
      }
      Category.find()
        .then((categories) => {
          res.render('item_form', {
            title: 'Update Item',
            categories,
            item,
            isUpdate: true,
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

// handle item update form
exports.item_update_post = [
  upload.single('uploaded_file'),
  [...itemFormValidators],
  authorizationValidator,
  fileValidator,
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
      _id: req.params.id,
    });

    if (req.file) {
      item.image_path = req.file.filename;
    }

    if (!errors.isEmpty()) {
    // has errors, re-render required
    // display all categories as options
      Category.find()
        .then((categories) => {
          res.render('item_form', {
            title: 'Update Item',
            categories,
            item,
            errors: errors.array(),
          });
        })
        .catch((err) => next(err));
    }

    // data validated
    Item.findByIdAndUpdate(req.params.id, item)
      .then((updatedItem) => res.redirect(updatedItem.url))
      .catch((err) => next(err));
  },
];
