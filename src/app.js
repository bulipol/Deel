const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const createError = require('http-errors');
const contracts = require('./contracts/routes');
const jobs = require('./jobs/routes');
const balances = require('./balances/routes');
const admin = require('./admin/routes');
const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts', contracts);
app.use('/jobs', jobs);
app.use('/balances', balances);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    type: 'error',
    status: err.status,
    message: err.message
  });
});

module.exports = app;
