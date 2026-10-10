require("dotenv").config();
const express = require("express");
const { checkDatabaseConnection } = require("./check-db.js");
const { testRedis } = require("./check-redis.js");

const authRoutes=require("./routes/authRoutes.js")
const apikeyRoutes=require("./routes/apikeyRoutes.js")
const notificationRoutes=require("./routes/notificationRoutes.js")

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json({strict:false}));

app.use("/api/auth",authRoutes)
app.use("/api/keys",apikeyRoutes)
app.use("/api/notification",notificationRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Application running on ${PORT}`);
  checkDatabaseConnection();
  testRedis();
});