const crypto=require("crypto")
const ApiKey=require("../models/ApiKey.js")

const createApiKey=async(req,res)=>{
    const {name,scopes}=req.body || {};
    try{
        if(typeof name !== "string" || !name.trim()){
            return res.status(400).json({message:"Name is required for API key"})
        }

        if(scopes !== undefined && (!Array.isArray(scopes) || scopes.some(scope => typeof scope !== "string"))){
            return res.status(400).json({message:"Scopes must be an array of strings"})
        }

        const randomKey=crypto.randomBytes(32).toString("hex");

        const apiKey=`nx_${randomKey}`;

        const keyHash=crypto.createHash("sha256").update(apiKey).digest("hex");
        const prefix=apiKey.slice(0,7);

        const newApiKey=new ApiKey({
            userId:req.user.id,
            name:name.trim(),
            keyHash,
            prefix,
            scopes:scopes||[]
        })
        await newApiKey.save();

        return res.status(201).json({
            message:"API key created successfully",
            name:name.trim(),
            apiKey,
            scopes:scopes||[]
        })
    }catch(e){
        if(e.code === 11000){
            return res.status(409).json({message:"An API key already exists for this user or name"});
        }
        return res.status(500).json({message:e.message});
    }
}

module.exports={
    createApiKey
}