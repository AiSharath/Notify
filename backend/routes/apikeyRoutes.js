const express=require("express");
const router=express.Router();

const{createApiKey}=require("../controllers/apikeyController.js")
const {auth}=require("../middleware/auth.js")

router.post("/",auth,createApiKey);

module.exports=router