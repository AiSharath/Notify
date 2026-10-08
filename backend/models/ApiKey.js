const mongoose=require("mongoose");

const ApiKeySchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        unique:true
    },
    name:{
        type:String,
        unique:true,
        required:true
    },
    keyHash:{
        type:String,
        required:true,
        unique:true
    },
    prefix:{
        type:String,
        required:true
    },
    scopes:{
        type:[String],
        default:[]
    },
    lastUsedAt:{
        type:Date,
        default:null
    },
    revoked:{
        type:Boolean,
        default:false
    }
})

const ApiKey=mongoose.model("ApiKey",ApiKeySchema);

module.exports=ApiKey