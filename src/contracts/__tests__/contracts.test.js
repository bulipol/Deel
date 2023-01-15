const request = require('supertest');
const app = require('../../app');
const { seed } = require('../../../db/db');

describe('Contracts', () => {
  beforeAll(async () => {
    await seed();
  });
  describe('/contracts/:id', () => {
    it('should return 401 when profile_id header mismatch with client or contractor', async () => {
      await request(app)
        .get('/contracts/1')
        .set('profile_id', '199')
        .expect(401);
    });

    it('should return 404 when contract not found', async () => {
      await request(app)
        .get('/contracts/199')
        .set('profile_id', '5')
        .expect(404);
    });

    it('should return contract when profile_id header matches with client', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts/1')
        .set('profile_id', '1');

      expect(statusCode).toEqual(200);
      expect(body).toMatchObject({
        id: 1,
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: 1,
        ContractorId: 5
      });
    });

    it('should return contract when profile_id header matches with contractor', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts/1')
        .set('profile_id', '5');

      expect(statusCode).toEqual(200);
      expect(body).toMatchObject({
        id: 1,
        terms: 'bla bla bla',
        status: 'terminated',
        ClientId: 1,
        ContractorId: 5
      });
    });
  });

  describe('/contracts', () => {
    it('should return non terminated contracts for the client', async () => {
      const { statusCode, body } = await request(app)
        .get('/contracts')
        .set('profile_id', '1');

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(1);
      expect(body).toMatchObject([
        {
          id: 2,
          terms: 'bla bla bla',
          status: 'in_progress',
          ClientId: 1,
          ContractorId: 6
        }
      ]);
    });
  });
});
