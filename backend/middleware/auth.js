const jwt=require("jsonwebtoken")


const auth=async (req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        const token=authHeader.split(" ")[1]

        const decoded=jwt.verify(token,process.env.JWT_ACCESS_SECRET)

        req.user=decoded;
        next();
        
    }catch(e){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
}

module.exports={auth};