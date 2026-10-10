const crypto = require("crypto");
const ApiKey = require("../models/ApiKey.js");

const apiKeyAuth = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const keyHash = crypto
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");

        const storedKey = await ApiKey.findOne({
            keyHash,
            revoked: false
        });

        if (!storedKey) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        storedKey.lastUsedAt = new Date();
        await storedKey.save();

        req.apiKey = storedKey;

        next();

    } catch (e) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};

module.exports = apiKeyAuth;