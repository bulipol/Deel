const request = require('supertest');
const app = require('../../app');
const { seed } = require('../../../db/db');

describe('Balances', () => {
  beforeAll(async () => {
    await seed();
  });
  describe('/balances/deposit/:userId', () => {
    it('should increase client balance', async () => {
      const { statusCode, body } = await request(app)
        .post('/balances/deposit/1')
        .send({ amount: 1.1 });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1151.1,
          type: 'client'
        })
      );
    });

    it('should return 400 if deposit exceeds the limit (25% of all unpaid jobs)', async () => {
      const { statusCode, body } = await request(app)
        .post('/balances/deposit/1')
        .send({ amount: 100.1 });

      expect(statusCode).toEqual(400);
      expect(body.message).toEqual('Deposit exceeds the limit');
    });

    it('should return 404 if client is not found', async () => {
      const { statusCode, body } = await request(app)
        .post('/balances/deposit/15')
        .send({ amount: 100.1 });

      expect(statusCode).toEqual(404);
      expect(body.message).toEqual('Client not found');
    });

    it('should return 404 if given user is not a client', async () => {
      const { statusCode, body } = await request(app)
        .post('/balances/deposit/5')
        .send({ amount: 100.1 });

      expect(statusCode).toEqual(404);
      expect(body.message).toEqual('Client not found');
    });
  });
});
