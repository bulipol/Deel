const { Router } = require('express');
const router = new Router();
const { getProfile } = require('../middleware/getProfile');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const {
  getAllUpaidActiveJobs,
  payContractorForAJob
} = require('./jobsController');

router.get(
  '/unpaid',
  asyncHandler(getProfile),
  asyncHandler(getAllUpaidActiveJobs)
);

router.post(
  '/:job_id/pay',
  asyncHandler(getProfile),
  check('job_id').isNumeric(),
  asyncHandler(payContractorForAJob)
);

module.exports = router;
