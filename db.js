const { Schema, default: mongoose } = require('mongoose')
mongoose.connect("mongodb+srv://samarJT1:gzjuXygktvSP6OlA@samarjt1.h1kh8oq.mongodb.net/Paytm")

const zod=require('zod')

const userSchema=new Schema({
    firstName:String,
    lastName:String,
    username:String,
    password:String
})

const User=mongoose.model("User",userSchema)

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})
const Account=mongoose.model("Account",accountSchema)

    module.exports=({
    User,
    Account
})