const express=require('express')
const accountRouter=require('./account')
const userRouter=require('./user')
const router=express.Router()


router.use('/user',userRouter)

router.use('/account',accountRouter)
// const app=express();
// const mongoose=require("mongoose")
// const zod=require("zod")

// const cors=require('cors')
// const bodyparser=require('body-parser')
// app.use(express.json())
// app.use(cors())
// app.listen(3000)
module.exports=router;
