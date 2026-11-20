const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes/discoverRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
