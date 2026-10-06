const mongoose=require("mongoose")
const bcryprt=require("bcrypt")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        required:true,
        default:"user"
    }
    },
    {
        timestamps:true
    } 
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}

const User=mongoose.model("User",userSchema);

module.exports={User};