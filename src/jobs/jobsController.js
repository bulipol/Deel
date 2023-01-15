const validateInput = require('../utils/validateInput');
const { getUpaidActiveJobs, payJob } = require('./jobsService');

const getAllUpaidActiveJobs = async (req, res) => {
  const userId = req.profile.id;
  const jobs = await getUpaidActiveJobs(userId);

  res.json(jobs);
};

const payContractorForAJob = async (req, res) => {
  validateInput(req, res);
  const clientId = req.profile.id;
  const jobId = req.params.job_id;

  const updatedJob = await payJob(jobId, clientId);

  res.json(updatedJob);
};

module.exports = {
  getAllUpaidActiveJobs,
  payContractorForAJob
};
