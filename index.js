const express = require("express");

const cors=require('cors')
const mainRouter=require("./routes/index")
const app=express();
app.use(cors({
    origin: 'https://vercel.com/samarj19s-projects/payment-frontend/GTWU26QqnvNG8D5J4uy4rHMqZuNX'
  }));
app.use(express.json())
app.use('/api/v1',mainRouter);
const port=process.env.PORT||3000;
app.listen(port)

