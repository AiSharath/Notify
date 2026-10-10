const { Queue } = require("bullmq");
const { redis } = require("../config/redis.js");

const emailQueue = new Queue("email", {
  connection: redis
});

module.exports = { emailQueue };
