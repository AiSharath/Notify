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

module.exports={
    generateAccessToken,
    generateRefreshToken
}