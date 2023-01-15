const { Router } = require('express');
const router = new Router();
const {
  parameterPollutionProtection
} = require('../middleware/protectParameter');
const asyncHandler = require('express-async-handler');
const { query } = require('express-validator');
const {
  getBestPaidProfessionInTimeRange,
  getHighestPayingClientsInTimeRange
} = require('./adminController');

// I assume anyone can access those endpoints
router.get(
  '/best-profession',
  asyncHandler(parameterPollutionProtection),
  query('start').isISO8601().toDate(),
  query('end').isISO8601().toDate(),
  asyncHandler(getBestPaidProfessionInTimeRange)
);

router.get(
  '/best-clients',
  asyncHandler(parameterPollutionProtection),
  query('start').isISO8601().toDate(),
  query('end').isISO8601().toDate(),
  query('limit').optional().isNumeric(),
  asyncHandler(getHighestPayingClientsInTimeRange)
);

module.exports = router;
