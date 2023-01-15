const { Router } = require('express');
const router = new Router();
const asyncHandler = require('express-async-handler');
const { check, body } = require('express-validator');
const {
  depositMoneyToClientAccountUpToQuarterOfObligation
} = require('./balancesController');

// I assume anyone can deposit money to client's account
router.post(
  '/deposit/:userId',
  check('userId').isNumeric(),
  body('amount').isNumeric(),
  asyncHandler(depositMoneyToClientAccountUpToQuarterOfObligation)
);

module.exports = router;
