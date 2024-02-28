const express = require("express");
const router = express.Router();
// require("dotenv").config();
const user_schema = require('../../db/new_schema/user')
const post_schema = require('../../db/new_schema/posts')
const fetch_person = require('./midile_ware')

router.post("/post-like", fetch_person, async (req, res) => {
    try {
          const user_id = await user_schema.findById(req.mongoid) 
             
          const post_id = req.body.like;
            const post = await post_schema.findById(post_id);
          
          // res.json("like")
          const hai = await post.like.includes(user_id._id)
          if(!hai){
            const data = await post_schema.findByIdAndUpdate(post_id,{
              $push:{like:user_id,
                like_id:user_id._id
              }
              
            },{new: true}
            )

            return res.json({success: true,data})
          }
          return res.json({success:false, msg: "user already like post"})
         
   
    } catch (err) {
      res.status(500).json({ error: "Unknown error" });
    }
  });

  router.post("/post-unlike", fetch_person, async (req, res) => {
    try {
          const user_id = await user_schema.findById(req.mongoid) 
             
          const post_id = req.body.unlike;
            // const post = await post_schema.findById(post_id);
          
            // for(let i=0; i< post.like.length; i++){
            //   // console.log(post.like[i]._id);
            //         if(post.like[i]._id===user_id._id){
            //           post.like.splice(user_id._id,1);
            //           post.like_id.splice(user_id._id,1)
            //         }
            // }
            const data = await post_schema.findByIdAndUpdate(post_id,{
              $pull:{like:user_id._id,
                like_id:user_id._id
              }
            },{new: true})

            // await post.save()
          return res.json({success:true,data})
          // res.json("like")
          // const hai = await post.like.includes(user_id._id)
          // if(!hai){
          //   const data = await post_schema.findByIdAndUpdate(post_id,{
          //     $push:{like:user_id,
          //       like_id:user_id._id
          //     }
              
          //   },{new: true}
          //   )

          //   return res.json({success: true,data})
          // }
          // return res.json({success:false, msg: "user already like post"})
         
   
    } catch (err) {
      res.status(500).json({ error: "Unknown error" });
    }
  });



//   router.put('/like',requireLogin,(req,res)=>{
//     Post.findByIdAndUpdate(req.body.postId,{
//         $push:{likes:req.user._id}
//     },{
//         new:true
//     }).exec((err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }else{
//             res.json(result)
//         }
//     })
// })





module.exports = router