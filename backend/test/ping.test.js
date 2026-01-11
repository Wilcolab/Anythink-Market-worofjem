const request = require('supertest');
const { expect } = require('chai');
const nock = require('nock');

// Ensure tests use the same baseURL as lib/event.js default
const ENGINE_BASE_URL = process.env.ENGINE_BASE_URL || 'https://engine.wilco.gg';

describe('GET /api/ping', function() {
  let app;

  before(function() {
    // stub the external event endpoint
    nock(ENGINE_BASE_URL)
      .post(/\/users\/.+\/event/)
      .reply(200, { ok: true, pong: true });

    // require app after nock is configured
    app = require('../app');
  });

  after(function() {
    nock.cleanAll();
  });

  it('responds with JSON from sendEvent', async function() {
    const res = await request(app).get('/api/ping');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('ok', true);
    expect(res.body).to.have.property('pong', true);
  });
});
