const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    Name:{
        type: String,
        required : true
    },
    Email:{
        type:String,
        required : true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        min:4
    },
    followers:[{
        type:ObjectId,ref:"User"
    }],
    following:[{
        type:ObjectId,ref:"User"
    }]
})

module.exports = mongoose.model("User",userSchema)
