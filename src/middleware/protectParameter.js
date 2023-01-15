const createError = require('http-errors');
const parameterPollutionProtection = async (req, res, next) => {
  Object.keys(req.query).map((key) => {
    if (typeof req.query[key] !== 'string') {
      if (Array.isArray(req.query[key])) req.query[key] = req.query[key][0];
      else {
        throw createError(400, 'Bad parameters');
      }
    }
  });
  next();
};

module.exports = { parameterPollutionProtection };
