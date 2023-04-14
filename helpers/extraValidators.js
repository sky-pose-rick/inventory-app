const { body } = require('express-validator');

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
  cb(null, req.body[inputName] === filePassword);
};
