const mongoose=require("mongoose")
const {Notification}=require("../models/Notification.js")
const {User}=require("../models/User.js")
const {emailQueue}=require("../queue/emailQueue.js")
const {inAppQueue}=require("../queue/inAppQueue.js")
const {pushQueue}=require("../queue/pushQueue.js")

const createNotification=async(req,res)=>{
    const{recepientId,title,body,channels}=req.body;
    try{
        if(!mongoose.Types.ObjectId.isValid(recepientId)){
            return res.status(400).json({message:"Invalid recepient ID"});
        }

        const recepientExists=await User.findOne({_id:recepientId})
        if(!recepientExists){
            return res.status(400).json({
                message:"User with this id does not exixts"
            })
        }

        const senderId=req.user.id||req.user._id;

        const status={}
        
        for(const channel in channels){
            status[channel]="queued"
        }

        const notification=await Notification.create({
            recepientId,
            senderId,
            title,
            body,
            channels,
            status,
            source:req.apiKey?"api":"dashboard"
        })

        const queues={
            email:emailQueue,
            push:pushQueue,
            inapp:inAppQueue
        }

        await Promise.all(
            channels.map((channel) =>
                queues[channel].add("deliver", {
                    notificationId: notification._id.toString(),
                })
            )
        );

        return res.status(202).json({
            message:"Notification accepted for processing",
            notificationId:notification._id,
            status:notification.status
        })
    }catch(e){
        console.error("Create notification error",e.message)

        return res.status(500).json({
            message:"Failed to create notification"
        })
    }
}

module.exports={
    createNotification
}