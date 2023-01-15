const {
  getAllUpaidActiveJobs,
  payContractorForAJob
} = require('./jobsRepository');

const getUpaidActiveJobs = (userId) => getAllUpaidActiveJobs(userId);
const payJob = (jobId, clientId) => payContractorForAJob(jobId, clientId);

module.exports = {
  getUpaidActiveJobs,
  payJob
};
