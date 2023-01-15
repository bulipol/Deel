const {
  getBestPaidProfessionInTimeRange,
  getHighestPayingClientsInTimeRange
} = require('./adminRepository');

const getBestProfession = (start, end) =>
  getBestPaidProfessionInTimeRange(start, end);
const getBestClient = (start, end, limit) =>
  getHighestPayingClientsInTimeRange(start, end, limit);

module.exports = {
  getBestProfession,
  getBestClient
};
