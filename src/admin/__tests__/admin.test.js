const request = require('supertest');
const app = require('../../app');
const { seed } = require('../../../db/db');

describe('Admin', () => {
  beforeAll(async () => {
    await seed();
  });
  describe('/admin/best-profession', () => {
    it('should return best paid profession in provided time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2018-01-01 08:00:00' })
        .query({ end: '2023-01-15 08:00:00' });

      expect(statusCode).toEqual(200);
      expect(body).toEqual(
        expect.objectContaining([
          {
            profession: 'Programmer',
            earned: 2683
          }
        ])
      );
    });

    it('should return empty array if there are no jobs in provided time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2010-05-12 08:00:00' })
        .query({ end: '2020-01-15 08:00:00' });

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(0);
    });
  });

  describe('/admin/best-clients', () => {
    it('should return list of (default 2) clients who paid most in provided time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2018-05-12 08:00:00' })
        .query({ end: '2023-01-15 08:00:00' });

      expect(statusCode).toEqual(200);
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 4,
          fullName: 'Ash Kethcum',
          paid: 2020
        })
      );
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 1,
          fullName: 'Harry Potter',
          paid: 442
        })
      );
    });

    it('should limit the list by query param', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2018-05-12 08:00:00' })
        .query({ end: '2023-01-15 08:00:00' })
        .query({ limit: 1 });

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(1);
      expect(body).toContainEqual(
        expect.objectContaining({
          id: 4,
          fullName: 'Ash Kethcum',
          paid: 2020
        })
      );
    });

    it('should return empty array if there are no jobs in provided time range', async () => {
      const { statusCode, body } = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2010-05-12 08:00:00' })
        .query({ end: '2020-01-15 08:00:00' });

      expect(statusCode).toEqual(200);
      expect(body).toHaveLength(0);
    });
  });
});
