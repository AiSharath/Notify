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

const listApiKeys = async (req, res) => {
    try {
        const apiKeys = await ApiKey.find({
            userId: req.user.id
        }).select("-keyHash");

        return res.status(200).json({ apiKeys });
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const revokeApiKey = async (req, res) => {
    try {
        const apiKey = await ApiKey.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!apiKey) {
            return res.status(404).json({
                message: "API key not found"
            });
        }

        if (apiKey.revoked) {
            return res.status(400).json({
                message: "API key already revoked"
            });
        }

        apiKey.revoked = true;
        await apiKey.save();

        return res.status(200).json({
            message: "API key revoked successfully"
        });
    } catch (e) {
        if (e.name === "CastError") {
            return res.status(400).json({
                message: "Invalid API key ID"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    createApiKey,
    listApiKeys,
    revokeApiKey
};