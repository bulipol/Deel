const validateInput = require('../utils/validateInput');
const createError = require('http-errors');
const { getContractById, getNonTerminated } = require('./contractsService');

const getUserContractById = async (req, res) => {
  validateInput(req, res);
  const { id } = req.params;
  const userId = req.profile.id;

  const contract = await getContractById(id, userId);

  if (!contract) {
    throw createError(404, 'Contract not found');
  }

  res.json(contract);
};

const getNonTerminatedUserContracts = async (req, res) => {
  const userId = req.profile.id;
  const contracts = await getNonTerminated(userId);

  res.json(contracts);
};

module.exports = {
  getUserContractById,
  getNonTerminatedUserContracts
};
