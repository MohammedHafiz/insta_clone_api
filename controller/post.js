const Post = require('../models/post-schema')

//to create a post
exports.createPost = (req,res)=>{
    console.log("inside route");
    const {title,body} = req.body
    if(!title || !body){
        res.status(422).json({error:"please add all the fields"})
    }
    console.log("UserDetails",req.user);

    const post = new Post({
        title,
        body,
        postedBy:req.user

    })
    post.save().then((result)=>{
        res.status(200).json({post:result})
    })
    .catch((err)=>{
        console.log(err);
    })
}

//to get the post of user which is loggedIn
exports.myPost = (req,res)=>{
    console.log(req.user);
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id Name")
    .then(myPost=>{
        console.log(myPost);
        res.json({myPost})
    })
    .catch(err=>{
        console.log(err);
    })
}

//to get all posts of users
exports.getAllpost =(req,res)=>{
    Post.find()
    .populate("postedBy","_id Name")
    //.populate("comments.postedBy", "_id Name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
}

//to get all posts of users who are following you
exports.followersPost =(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id Name")
    //.populate("comments.postedBy", "_id Name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
}

//to update the post collection for like
exports.post_like=(req,res)=>{   
    Post.findByIdAndUpdate(req.body.postId,{
        $addToSet:{likes:req.user._id}
    
},{
    new:true
}).exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
        res.status(200).json(result)
    }
})

}

//to update the post collection for unlike
exports.post_unlike = (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    
},{
    new:true
}).exec((err,result)=>{
    if(err){
        return res.status(422).json({error:err})
    }else{
        res.status(200).json(result)
    }
})

}

// to comment on a post
exports.post_comment = (req,res)=>{
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy" ," _id Name ")
    .exec((err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
}