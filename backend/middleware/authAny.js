const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { ApiKey } = require("../models/ApiKey.js");

async function authAny(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers["x-api-key"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;
        return next();
      } catch (err) {
        if (!apiKey) {
          return res.status(401).json({
            message: "Invalid or expired access token",
          });
        }
      }
    }

    if (apiKey) {
      const keyHash = crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");

      const storedKey = await ApiKey.findOne({
        keyHash,
        revoked: false,
      });

      if (!storedKey) {
        return res.status(401).json({
          message: "Invalid or revoked API key",
        });
      }

      storedKey.lastUsedAt = new Date();
      await storedKey.save();

      req.apiKey = storedKey;
      req.user = { id: storedKey.userId.toString() };

      return next();
    }

    return res.status(401).json({
      message: "Authentication required",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Authentication failed",
    });
  }
}

module.exports = authAny;