const jwt=require("jsonwebtoken")

const generateAccessToken=async (id)=>{
    return jwt.sign(
        {
            id
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn:"15m"
        }
    )
}

const generateRefreshToken=async (id)=>{
    return jwt.sign(
        {
            id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn:"7d"
        }
    )
}

const verifyRefreshToken=async(token)=>{
    return jwt.verify(token,process.env.JWT_REFRESH_SECRET);
}

module.exports={
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
}