const express = require("express");
const serverless = require('serverless-http');
const cors=require('cors')
const mainRouter=require("./routes/index")
const app=express();
app.use(cors())
app.use(express.json())
app.use('/.netlify/functions/api/v1',mainRouter);
const port=process.env.PORT||3000;
app.listen(port)
module.exports.handler = serverless(app);
