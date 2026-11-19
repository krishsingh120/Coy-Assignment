require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./utils/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] Coy Discover Backend running on port ${PORT}`);
      console.log(`[Server] Health: http://localhost:${PORT}/health`);
      console.log(`[Server] Feed API: http://localhost:${PORT}/feed`);
    });
  } catch (err) {
    console.error('[Server] Fatal error during startup:', err);
    process.exit(1);
  }
}

startServer();
