const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
let mongod;

before(async function() {
  this.timeout(20000);
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = await mongod.getUri();
  console.log('MONGODB_URI (test):', process.env.MONGODB_URI);
  // connect mongoose directly for tests
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});
