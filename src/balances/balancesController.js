const validateInput = require('../utils/validateInput');
const { depositMoney } = require('./balancesService');

const depositMoneyToClientAccountUpToQuarterOfObligation = async (req, res) => {
  validateInput(req, res);
  const clientId = req.params.userId;
  const { amount } = req.body;

  const profile = await depositMoney(clientId, Number(amount));

  res.json(profile);
};

module.exports = {
  depositMoneyToClientAccountUpToQuarterOfObligation
};
