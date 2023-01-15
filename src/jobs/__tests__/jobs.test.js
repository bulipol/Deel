const request = require('supertest');
const app = require('../../app');
const { seed } = require('../../../db/db');

describe('Jobs', () => {
  beforeAll(async () => {
    await seed();
  });
  describe('/jobs/unpaid', () => {
    it('should return only unpaid jobs', async () => {
      const { statusCode, body } = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', '1');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(1);
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 2,
          description: 'work',
          price: 201,
          ContractId: 2
        })
      );
    });

    it('should return unpaid jobs only for in_progress contracts', async () => {
      const { statusCode, body } = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', '8');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(0);
    });
  });

  describe('/jobs/:id/pay', () => {
    it('should return 404 when job is not found', async () => {
      const { statusCode, body } = await request(app)
        .post('/jobs/15/pay')
        .set('profile_id', '1');

      expect(statusCode).toEqual(404);
      expect(body.message).toEqual('Job not found');
    });

    it('should return 400 when client has insufficient funds', async () => {
      const { statusCode, body } = await request(app)
        .post('/jobs/5/pay')
        .set('profile_id', '4');

      expect(statusCode).toEqual(400);
      expect(body.message).toEqual('Insufficient funds');
    });

    it('should mark job as paid', async () => {
      const { statusCode, body } = await request(app)
        .post('/jobs/1/pay')
        .set('profile_id', '1');

      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining({
          id: 1,
          description: 'work',
          price: 200,
          ContractId: 1,
          paid: true,
          paymentDate: expect.any(String)
        })
      );
    });

    it('should return 409 when job is already paid', async () => {
      const { statusCode, body } = await request(app)
        .post('/jobs/1/pay')
        .set('profile_id', '1');

      expect(statusCode).toEqual(409);
      expect(body.message).toEqual('Job is already paid');
    });
  });
});
