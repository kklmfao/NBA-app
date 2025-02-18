const NodeCache = require('node-cache');

// Create a new cache instance with a default TTL of 1 hour
const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 120
});

module.exports = cache;