const { Op } = require('sequelize');
const { Contract, CONTRACT_STATUSES } = require('../model');

const getUserContractById = (id, userId) =>
  Contract.findOne({
    where: {
      id,
      [Op.or]: [
        {
          ClientId: userId
        },
        {
          ContractorId: userId
        }
      ]
    }
  });

const getNonTerminatedUserContracts = (userId) =>
  Contract.findAll({
    where: {
      [Op.or]: [
        {
          ClientId: userId
        },
        {
          ContractorId: userId
        }
      ],
      status: { [Op.ne]: CONTRACT_STATUSES.TERMINATED }
    }
  });

module.exports = {
  getUserContractById,
  getNonTerminatedUserContracts
};
