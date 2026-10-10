
const { Queue } = require("bullmq");
const { redis } = require("../config/redis.js");

const inappQueue = new Queue("inapp", {
  connection: redis
});

module.exports = { inappQueue };
