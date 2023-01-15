const validateInput = require('../utils/validateInput');
const { getBestProfession, getBestClient } = require('./adminService');

const getBestPaidProfessionInTimeRange = async (req, res) => {
  validateInput(req, res);
  const { start, end } = req.query;
  const bestProfession = await getBestProfession(start, end);

  res.json(bestProfession);
};

const getHighestPayingClientsInTimeRange = async (req, res) => {
  validateInput(req, res);
  const { start, end, limit } = req.query;
  const bestClient = await getBestClient(start, end, limit);

  res.json(bestClient);
};

module.exports = {
  getBestPaidProfessionInTimeRange,
  getHighestPayingClientsInTimeRange
};
