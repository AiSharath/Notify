const { User } = require("../models/User.js");
const bcrypt = require("bcryptjs");
const {generateAccessToken,generateRefreshToken,verifyRefreshToken}=require("../utils/token.js")

const registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }


        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        return res.status(201).json({
            message: "User registered successfully"
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken=await generateAccessToken(user._id);
        const refreshToken=await generateRefreshToken(user._id);

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken
        });
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const refreshAccessToken=async (req,res)=>{
    const {refreshToken}=req.body;

    try{
        if(!refreshToken){
            return res.status(401).json({message:"Unauthorized"})
        }

        const decoded=await verifyRefreshToken(refreshToken);

        const accessToken=await generateAccessToken(decoded.id);

        return res.status(200).json({accessToken})
    }catch(e){
        return res.status(401).json({message:e.message})
    }
}

const getMe=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)

        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        return res.status(200).json({user})
    }catch(e){
        return res.status(500).json({message:e.message})
    }
}

module.exports = { registerUser, loginUser , refreshAccessToken, getMe};
