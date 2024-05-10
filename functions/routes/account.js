const express=require('express')
const router=express.Router()   
const zod=require('zod')
const {Account}=require('../db')
const {authMiddleware} = require('../middleware')
const { default: mongoose } = require('mongoose')
const jwt=require('jsonwebtoken')
const JWT_SECRET = require('../config')


router.get('/balance',authMiddleware,async(req,res)=>{

    const bal=await Account.findOne({userId:req.userId})
    res.json({"message":bal.balance})
})


router.post('/transfer',authMiddleware,async(req,res)=>{

    const session=await mongoose.startSession();
    session.startTransaction();
    const {to,amount}=req.body
    const account=await Account.findOne({userId:req.userId}).session(session)
    if(!account||account.balance<amount){
        session.abortTransaction();
        res.status(400).json({
            message: "Insufficient balance"
        })
    }
    const toaccount=await Account.findOne({userId:to}).session(session)
    if(!toaccount){
        session.abortTransaction();
        res.status(400).json({
            message: "Invalid account"
        })
    }
    await Account.updateOne({userId:req.userId},{
        "$inc":{
            balance:-amount
        }
    }).session(session)
    await Account.updateOne({userId:to},{   
        "$inc":{
            balance:amount
        }
    }).session(session)
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    })
})
router.post("/me",async(req,res)=>{
    const token=req.body.token
    
    const payload=jwt.decode(token,JWT_SECRET)
    
    const id=payload.userId;
    
    const account=await Account.findOne({userId:id})
    res.json({
        balance:account.balance,
       
    })
})

module.exports=router;