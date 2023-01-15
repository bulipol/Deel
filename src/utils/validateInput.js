const { validationResult } = require('express-validator');
const createError = require('http-errors');

module.exports = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError(400, 'Validation error');
  }
};
