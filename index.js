const express = require("express");

const cors=require('cors')
const mainRouter=require("./routes/index")
const app=express();
app.use(cors({
    origin: 'https://vercel.com/samarj19s-projects/fresh-frontend-for-payments-app/FXPAtNxn8gjNxLYsco1MJUb27hat'
  }));
app.use(express.json())
app.use('/api/v1',mainRouter);
const port=process.env.PORT||3000;
app.listen(port)

