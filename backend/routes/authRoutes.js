const express=require("express");
const router=express.Router()

const {registerUser,loginUser,refreshAccessToken,getMe}=require("../controllers/userController.js")
const {auth}=require("../middleware/auth.js")


router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/refresh",refreshAccessToken);
router.get("/me",auth,getMe);

module.exports=router;


