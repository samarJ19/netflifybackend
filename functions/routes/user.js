const express=require('express')
const zod=require('zod')
const router=express.Router()
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const { User }=require('../db')
const { Account }=require('../db')
const JWT_SECRET = require('../config')
const {authMiddleware} = require('../middleware')
const signupSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})

router.post('/signup', async (req,res)=>{
        const body=req.body;   
        const {success}=signupSchema.safeParse(req.body)

        if(!success){
            res.status(411).json({
                message: "Email already taken / Incorrect inputs "
            })
            return
        }
        const user=await User.findOne({
            username:body.username
        })
        if(user){
            res.status(411).json({
                message: "Email already taken / Incorrect inputs "
            })
            return
        }
        const dbuser=await User.create(body)
        const userbalance=await Account.create({
            userId:dbuser._id,
            balance:Math.floor(Math.random()*(10000)+1)
        })
        const token=jwt.sign({
            userId:dbuser._id
        },JWT_SECRET)

        res.status(200).json({
            message: "User created successfully",
            token: token
        })
})

const signinSchema=zod.object({
    username:zod.string(),
    password:zod.string()
})
router.post('/signin',async (req,res)=>{
    const body=req.body;
    const {success}=signinSchema.safeParse(body)
    if(!success){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
        return
    }
    const user=await User.findOne(
        {username:body.username,
         password:body.password
        })
    if(user){
        const token=jwt.sign({userId:user._id},JWT_SECRET)
        res.json({
            token: token
        })
        return
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateSchema=zod.object({
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})
router.put('/update',authMiddleware ,async(req,res)=>{
    const body=req.body;
    const {success}=updateSchema.safeParse(body)
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
        return
    }
   const updateduser= await User.updateOne({
        _id:req.userId
    },body)
    if(updateduser){
        res.json({
            message: "Updated successfully"
        })
        return
    }
    res.json({
        message: "Error while updating information userId nahi milli"
    })
    return
    
})

router.post('/bulk', async(req,res)=>{
    const filter=req.query.filter||"";
    const token=req.headers.authorization
    
    const payload=jwt.decode(token,JWT_SECRET)
   
    const id=payload.userId
    try{
        const user=await User.find( { "_id": { "$ne": id } },{
            "firstName": 1,
            "lastName": 1,
            "username": 1,
            "_id": 1
          },{
            $or:[{
                firstName:{
                    "$regex":filter
                }
            },{
                lastName:{
                    "$regex":filter
                }
            }]
        },)
        
    res.json({
        user:user.map((x)=>({
            username:x.username,
            firstName:x.firstName,
            lastName:x.lastName,
            _id:x._id
        }))
    })
    }
    catch(e){
        console.log(e)
        res.json({message:"Some error in the filtering logic"})
    }

})

router.post("/me",async(req,res)=>{
    const token=req.body.token
    
    const payload=jwt.decode(token,JWT_SECRET)
   
    const id=payload.userId
    
    const user=await User.findOne({_id:id})
    res.json({
        firstName:user.firstName
    })
})

module.exports=router;