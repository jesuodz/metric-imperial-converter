'use strict';

// Import dependencies
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const routes = require('./routes/api');
const testRunner = require('./test-runner.js');

require('dotenv').config();

app.use(cors());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

app.use(express.static('public'));
app.use(routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/*', (req, res) => {
  res.status(404)
    .type('text')
    .send('Resource not found');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => { 
  console.log(`Listening on port ${port}`);

  if (process.env.NODE_ENV == 'test') {
    console.log('Running tests...');
    setTimeout(() => {
      try {
        testRunner.run();
      } catch(error) {
        console.log('Tests are not valid:', error);
      }
    }, 1500);
  }
});

module.exports = app;
