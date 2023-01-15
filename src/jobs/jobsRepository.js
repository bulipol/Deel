const { Op } = require('sequelize');
const createError = require('http-errors');
const {
  Contract,
  Job,
  Profile,
  sequelize,
  CONTRACT_STATUSES
} = require('../model');

const getAllUpaidActiveJobs = async (userId) =>
  Job.findAll({
    where: {
      paid: false
    },
    include: [
      {
        model: Contract,
        required: true,
        attributes: [],
        where: {
          [Op.or]: [
            {
              ClientId: userId
            },
            {
              ContractorId: userId
            }
          ],
          status: CONTRACT_STATUSES.IN_PROGRESS
        }
      }
    ]
  });

const payContractorForAJob = async (jobId, clientId) =>
  // this is "managed" Sequelize transaction, will auto commit and rollback in case of error
  await sequelize.transaction(async (t) => {
    const jobWithDetails = await Job.findOne(
      {
        where: {
          id: jobId
        },
        include: [
          {
            model: Contract,
            required: true,
            attributes: ['ContractorId'],
            where: {
              ClientId: clientId
            }
          }
        ]
      },
      { transaction: t }
    );

    if (!jobWithDetails) {
      throw createError(404, 'Job not found');
    }

    if (jobWithDetails.paid) {
      throw createError(409, 'Job is already paid');
    }

    const contractorId = jobWithDetails.Contract.ContractorId;

    const [client, contractor] = await Promise.all([
      Profile.findByPk(clientId, { transaction: t }),
      Profile.findByPk(contractorId, {
        transaction: t
      })
    ]);

    if (client.balance < jobWithDetails.price) {
      throw createError(400, 'Insufficient funds');
    }

    // move the money and mark as paid
    client.balance = parseFloat(
      (client.balance - jobWithDetails.price).toFixed(2)
    );
    contractor.balance = parseFloat(
      (contractor.balance + jobWithDetails.price).toFixed(2)
    );
    jobWithDetails.paid = true;
    jobWithDetails.paymentDate = new Date().toISOString();

    await Promise.all([
      client.save({ transaction: t }),
      contractor.save({ transaction: t }),
      jobWithDetails.save({ transaction: t })
    ]);

    return jobWithDetails;
  });

module.exports = {
  getAllUpaidActiveJobs,
  payContractorForAJob
};
