const express=require("express")
const {createNotification}=require("../controllers/notificationController.js")
const {authAny}=require("../middleware/authAny.js")
const {validate}=require("../middleware/validate.js")
const {notificationSchemas}=require("../validators/notificationSchemas.js")

const router=express.Router()

router.post("/",authAny,validate(notificationSchemas),createNotification)

module.exports=router;