const { body } = require('express-validator');
require('dotenv').config();

const filePassword = process.env.SECRET_FILE_PASSWORD || 'abc';
const authorizationPassword = process.env.SECRET_AUTHORIZATION_PASSWORD || 'xyz';

exports.fileValidator = body('file_password')
  .trim()
  .escape()
  .optional({ checkFalsy: true })
  .custom((input) => input === filePassword)
  .withMessage('Incorrect File Password');

exports.authorizationValidator = body('authorization_password', 'Authorization Password Must be Provided')
  .trim()
  .escape()
  .custom((input) => input === authorizationPassword)
  .withMessage('Incorrect Authorization Password');

exports.makeFileFilter = (inputName) => (req, file, cb) => {
  if (req.body[inputName] === filePassword) {
    console.log('file upload accepted');
    cb(null, true);
  } else {
    console.log('file upload rejected');
    cb(null, false);
  }
};
