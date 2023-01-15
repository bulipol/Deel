const { Op } = require('sequelize');
const {
  Contract,
  Job,
  Profile,
  sequelize,
  PROFILE_TYPES
} = require('../model');

const getBestPaidProfessionInTimeRange = async (start, end) =>
  await Profile.findAll({
    attributes: [
      'profession',
      [sequelize.fn('SUM', sequelize.col('price')), 'earned']
    ],
    where: {
      type: PROFILE_TYPES.CONTRACTOR
    },
    include: [
      {
        model: Contract,
        as: 'Contractor',
        attributes: [],
        required: true,
        include: [
          {
            model: Job,
            required: true,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.between]: [start, end]
              }
            }
          }
        ]
      }
    ],
    group: ['profession'],
    order: [[sequelize.col('earned'), 'DESC']],
    subQuery: false,
    limit: 1
  });

const getHighestPayingClientsInTimeRange = async (start, end, limit = 2) =>
  await Profile.findAll({
    attributes: [
      'id',
      [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
      [sequelize.fn('SUM', sequelize.col('price')), 'paid']
    ],
    where: {
      type: PROFILE_TYPES.CLIENT
    },
    include: [
      {
        model: Contract,
        as: 'Client',
        attributes: [],
        required: true,
        include: [
          {
            model: Job,
            required: true,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.between]: [start, end]
              }
            }
          }
        ]
      }
    ],
    group: ['firstName', 'lastName', 'profession', 'balance'],
    order: [[sequelize.col('paid'), 'DESC']],
    subQuery: false,
    limit
  });

module.exports = {
  getBestPaidProfessionInTimeRange,
  getHighestPayingClientsInTimeRange
};
