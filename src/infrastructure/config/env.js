'use strict';

const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/greencart',
  seedOnStart: process.env.SEED_ON_START === 'true',
};

module.exports = config;