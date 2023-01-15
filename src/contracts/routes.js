const { Router } = require('express');
const router = new Router();
const { getProfile } = require('../middleware/getProfile');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const {
  getUserContractById,
  getNonTerminatedUserContracts
} = require('./contractsController');

router.get(
  '/:id',
  asyncHandler(getProfile),
  check('id').isNumeric(),
  asyncHandler(getUserContractById)
);

router.get(
  '/',
  asyncHandler(getProfile),
  asyncHandler(getNonTerminatedUserContracts)
);

module.exports = router;
