const express = require('express');

const router = express.Router();

// index, redirect to category list
router.get('/', (req, res, next) => {
  res.redirect('/inventory');
});

module.exports = router;
