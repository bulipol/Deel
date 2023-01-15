const {
  getUserContractById,
  getNonTerminatedUserContracts
} = require('./contractsRepository');

const getContractById = (id, userId) => getUserContractById(id, userId);
const getNonTerminated = (userId) => getNonTerminatedUserContracts(userId);

module.exports = {
  getContractById,
  getNonTerminated
};
