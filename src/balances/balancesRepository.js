const createError = require('http-errors');
const {
  Contract,
  Profile,
  Job,
  sequelize,
  CONTRACT_STATUSES
} = require('../model');

const depositMoneyToClientAccountUpToQuarterOfObligation = async (
  clientId,
  amount
) =>
  await sequelize.transaction(async (t) => {
    const client = await Profile.findByPk(clientId, { transaction: t });

    if (!client || client.type !== 'client') {
      throw createError(404, 'Client not found');
    }

    const sumOfAllUnpaidJobs = await getClientUnpaidJobsSum(clientId);
    const depositLimit = sumOfAllUnpaidJobs / 4;

    if (amount > depositLimit) {
      throw createError(400, 'Deposit exceeds the limit');
    }

    client.balance = parseFloat((client.balance + amount).toFixed(2));

    await client.save({ transaction: t });

    return client;
  });

const getClientUnpaidJobsSum = async (clientId) =>
  Job.sum('price', {
    where: {
      paid: false
    },
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          status: CONTRACT_STATUSES.IN_PROGRESS,
          ClientId: clientId
        }
      }
    ]
  });

module.exports = {
  depositMoneyToClientAccountUpToQuarterOfObligation
};
