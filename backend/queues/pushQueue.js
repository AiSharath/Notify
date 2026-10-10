
const { Queue } = require("bullmq");
const { redis } = require("../config/redis.js");

const pushQueue = new Queue("push", {
  connection: redis
});

module.exports = { pushQueue };
