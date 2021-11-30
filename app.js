const express = require('express');
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv');
dotenv.config();
//destructuring from keys.js
// const {MONGO_URL} = require('./keys')


// const userRouter = require('./routes/auth')
// app.use('/',userRouter)

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('connected',()=>{
    console.log("connected to MongoDB");
})
mongoose.connection.on('error',(err)=>{
    console.log("Error connecting",err);
})

app.use(express.json());
app.use(require('./routes/auth'))
app.use(require('./routes/post'))






app.listen(PORT,()=>{
    console.log("Sever connected on",PORT);
})
