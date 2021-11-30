const User = require ('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



exports.userSignup = (req, res) => {
    console.log(req.body);
    const { Name, Email, Password } = req.body
    if (!Email || !Password || !Name) {
        return res.status(422).json({ error: "please add all fields" })
    }
    User.findOne({ Email: Email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with this email" })
            }
            bcrypt.hash(Password, 10).then(hashedPassword => {
                const user = new User({
                    // Name:req.body.Name ,  since we already destructured we can use Name:Name or simply Name
                    Name, 
                    Email, 
                    Password :hashedPassword
                })
                user.save()
                    .then((user) => {
                        res.status(200).json({ meassage: "saved succesfully" })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
                .catch(err => {
                    console.log(err);
                })
        })



}

exports.userSignin = (req,res)=>{
    const {Email,Password} = req.body;
    if(!Email || !Password){
        return res.status(422).json({error:'Please fill the details'})
    }
    User.findOne({Email:Email}).then(userData=>{
        console.log(userData);
        if(!userData){
          return  res.status(422).json({error:'Enterd Email is wrong'})
        }
        bcrypt.compare(Password,userData.Password).then((ifMatched)=>{
            if(ifMatched){
                //res.status(200).json({message:"Succesfully Signed in"})
                const token =  jwt.sign({_id:userData._id},process.env.JWT_SECERT)
                const {_id,Name,Email,followers,following} = userData
                res.status(200).json({token,user:{_id,Name,Email,followers,following}})

            }else{
               return res.status(422).json({error:'Entered Password is wrong'})
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.follow_user =(req,res)=>{
    console.log("inside router");
    User.findByIdAndUpdate(req.body.followId,{
        $addToSet:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $addToSet:{following:req.body.followId}
        },{
            new:true
        }).select("-Password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
}

exports.unfollow_user =(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select("-Password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
}