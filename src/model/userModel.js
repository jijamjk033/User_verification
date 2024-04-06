const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
       
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    is_admin:{
        type:Number,
        required:true
    },
    bio:{
        type:Number
    },
    is_private:{
        type:Boolean,
        default:false
    }
    });

module.exports = mongoose.model("User",userSchema);