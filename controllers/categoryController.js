// index
exports.index = (req, res, next) => {
  res.redirect('/inventory/categories');
};

// all categories
exports.category_list = (req, res, next) => {
  res.send('Not implemented');
};

// specific category
exports.category_detail = (req, res, next) => {
  res.send('Not implemented');
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
