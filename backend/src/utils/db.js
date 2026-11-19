const mongoose = require('mongoose');

let mongodInstance = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[DB] Connecting to MongoDB at ${uri.replace(/\/\/.*@/, '//<credentials>@')}...`);
      await mongoose.connect(uri);
      console.log('[DB] Connected successfully to MongoDB.');
      return;
    } catch (err) {
      console.warn('[DB] Failed connecting to configured MONGODB_URI:', err.message);
      if (process.env.NODE_ENV === 'production') {
        throw err;
      }
      console.log('[DB] Falling back to in-memory MongoDB for local development/demo...');
    }
  }

  // Fallback to in-memory MongoDB for local evaluation and testing without pre-installed mongod
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    console.log('[DB] Starting ephemeral in-memory MongoDB server at', memoryUri);
    await mongoose.connect(memoryUri);
    console.log('[DB] In-memory MongoDB connected successfully.');
  } catch (err) {
    console.error('[DB] Could not start MongoDB connection:', err.message);
    throw err;
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[DB] Disconnected from MongoDB.');
  } catch (err) {
    console.error('[DB] Error during disconnect:', err.message);
  }
}

module.exports = {
  connectDB,
  disconnectDB
};
