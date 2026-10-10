const express = require("express");

const {
    registerUser,
    loginUser,
    refreshAccessToken,
    getMe
} = require("../controllers/userController.js");

const { auth } = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");

const {
    registerSchema,
    loginSchema,
    refreshSchema
} = require("../validators/authSchemas.js");

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", validate(refreshSchema), refreshAccessToken);
router.get("/me", auth, getMe);

module.exports = router;