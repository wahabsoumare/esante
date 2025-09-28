const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;