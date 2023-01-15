const {
  depositMoneyToClientAccountUpToQuarterOfObligation
} = require('./balancesRepository');

const depositMoney = (clientId, amount) =>
  depositMoneyToClientAccountUpToQuarterOfObligation(clientId, amount);

module.exports = {
  depositMoney
};
