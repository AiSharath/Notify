const express = require("express");

const {
    createApiKey,
    listApiKeys,
    revokeApiKey
} = require("../controllers/apikeyController.js");

const { auth } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const {
    createApiKeySchema
} = require("../validators/apikeySchemas.js");

const router = express.Router();

router.post("/", auth,validate(createApiKeySchema) ,createApiKey);
router.get("/", auth, listApiKeys);
router.delete("/:id", auth, revokeApiKey);

module.exports = router;