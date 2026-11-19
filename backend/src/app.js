const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const discoverRoutes = require('./routes/discoverRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true
}));

app.use(express.json());

// Request logging (concise format for cleaner logs)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'coy-discover-backend' });
});

// Mount discover routes at root and /api for compatibility
app.use('/', discoverRoutes);
app.use('/api', discoverRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
