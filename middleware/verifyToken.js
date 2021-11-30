const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')


module.exports = (req,res,next)=>{

    const {authorization} = req.headers
   // console.log("authorization",authorization);

    if(!authorization){
        return res.status(401).json({error:"You must logged in"})
    }

    const token = authorization.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SECERT,(err,payload)=>{
        // console.log("payload: ",payload);
        // console.log("token",token);
        // console.log("JWT_SECERT",JWT_SECERT);
        if(err){
            return res.status(401).json({error:'You must be logged in'})
        }
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata;
            next()
        })
       
    })
}