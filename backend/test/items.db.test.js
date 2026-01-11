const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');

let app;

before(async () => {
  app = require('../app');
});

describe('DB-backed items', function() {
  it('creates a user and item and returns it from GET /api/items', async function() {
    const User = mongoose.model('User');
    const Item = mongoose.model('Item');

    // ensure clean collections to avoid unique index conflicts
    await User.deleteMany({});
    await Item.deleteMany({});

    const user = new User({ username: 'tester', email: 'tester@example.com' });
    user.setPassword('password');
    await user.save();

    const item = new Item({ title: 'Test Item', description: 'desc', seller: user._id });
    await item.save();

    const res = await request(app).get('/api/items');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('items');
    expect(res.body.itemsCount).to.be.a('number');
    const found = res.body.items.find(i => i.title === 'Test Item');
    expect(found).to.exist;
  });
});
