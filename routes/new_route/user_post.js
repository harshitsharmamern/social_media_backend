const express = require("express");
const router = express.Router();
require("dotenv").config();
const user_schema = require('../../db/new_schema/user')
const post_schema = require('../../db/new_schema/posts')


const bcrypt = require('bcrypt');


router.get('/test',async(req,res)=>{
    const data = await user_schema.find();
    res.json({data})
})

const jwt = require('jsonwebtoken');

router.post('/user-signup',async(req,res)=>{
   try{
    const salt = await bcrypt.genSalt(10)
    let secpassword = await bcrypt.hash(req.body.password,salt)
    const user_exist = await user_schema.findOne({email : req.body.email})
    if(!user_exist){


      const data_save = await user_schema.create({
          Name : req.body.Name,
          password : secpassword,
          email : req.body.email
      })
      const jwt_data = {
        user_details : data_save,
        user_type : "basic"
    }
    const auth_token = jwt.sign(jwt_data, 'your-secret-key');

     return res.json({success:true , data_save,token :auth_token,jwt_data : jwt_data})
    }
    else{
        return res.json({success : false, message : "user already"})
    }
    }catch(err){
       if(err.code===11000){
        res.status(400).json({error: 'email already exist'})
       }
       res.json("error")
   }
})
////

///
router.post('/user-signin',async(req,res)=>{
    try{
        // const {password,email}= req.body
        const find_mail = await user_schema.findOne({email : req.body.email})
        // res.json(find_mail)
        
        if(!find_mail){
              return res.json({status:false, msg : "wrong cred"})
        }
        const iscompare = await bcrypt.compare(req.body.password,find_mail.password)
        
        if(!iscompare){
           return res.json({success:false ,error:"wrong pass"})
        }
        else{
            const jwt_data = {
                user_details : find_mail,
                user_type : "basic"
            }
            const auth_token = jwt.sign(jwt_data, 'your-secret-key');

            // localStorage.setItem("token", auth_token);

 
            res.json({success:true,  jwt_data, token :auth_token})}
        
    }
    catch(err){
        
        res.json({success : false,err , error:"email is not register"})
    }
 })
//
const fetch_person = require("./midile_ware")
//


//////post routes
router.post('/user-post',fetch_person,async(req,res)=>{
    

    try{
      const user_data = await user_schema.findById(req.mongoid)
      
      const data = await post_schema.create({
        title: req.body.title,
        description : req.body.description,
        postedby : user_data
    })
    res.json({status : true , success : data})
}
catch(err){
    res.json({err})
}
})



/*
router.post("/user-follows/:id",fetch_person , async (req,res)=>{
    try {
        const follows_id = req.params.id;
        const user_id = req.mongoid;
    
        // Update "user_id" to follow "follows_id"
        await user_schema.findByIdAndUpdate(
          user_id,
          { $push: { follows: [follows_id ]} },
          { new: true }
        );
    
        // Update "follows_id" to have "user_id" as a follower
        await user_schema.findByIdAndUpdate(
          follows_id,
          { $push: { followers:[ user_id ]} },
          { new: true }
        );
        const data = await user_schema.find({user_id})
    
        return res.json({ message: 'Successfully updated the follow relationship.',data });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
      }
})
*/
// const userregis = require('path/to/your/user_schema'); // Replace with the correct path to your user_schema file.
const userregis = require('../../db/new_schema/user')
router.post("/user-follows/:id", fetch_person, async (req, res) => {
  try {
    const follows_id = req.params.id;
    const user_id = req.mongoid;

    // Get the user's document to check if the follows_id already exists in follows or not
    const user = await userregis.findById(user_id);
    if (user.follows.includes(follows_id)) {
      return res.status(400).json({ error: 'Already following the user.' });
    }

    // Update "user_id" to follow "follows_id"
    user.follows.push(follows_id);
    await user.save();

    // Get the follows_id's document to check if the user_id already exists in followers or not
    const followsUser = await userregis.findById(follows_id);
    if (followsUser.followers.includes(user_id)) {
      return res.status(400).json({ error: 'User is already a follower.' });
    }

    // Update "follows_id" to have "user_id" as a follower
    followsUser.followers.push(user_id);
    await followsUser.save();

    return res.json({ message: 'Successfully updated the follow relationship.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

/////////////////////////like


//////////
router.get("/home",fetch_person,async(req,res)=>{
    
  try{
    const user = await user_schema.findById(req.mongoid)
    const all_post = await post_schema.find().populate("postedby")
    .populate("like")
    // const user_post = await user_schema.find({postedby : all_post.postedby})
    // const All_data = all

    res.json({status : true,success : true , all_post,user})
  }catch(err){
    res.json({status: false,success:false , msg : "error in catch"})
  }
})



router.get("/user-posts",fetch_person,async(req,res)=>{
    const user_login_id = req.mongoid

    const all_post = await post_schema.find({postedby : user_login_id})
    res.json({data : all_post, loginuser:user_login_id})
})

router.get("/admin-home",fetch_person,async(req,res)=>{
  const all_user = await user_schema.find({})
  res.json({all_user})
})


//////////////////////////search box
router.get("/search-page",async(req,res)=>{
  const all_user = await user_schema.find({})
  res.json({status:true , data : all_user})

})


//////////////////////////profile-page
router.get("/profile-page",fetch_person ,async(req,res)=>{
  const id = req.mongoid
        const user_data =   await user_schema.findById({_id : id})
  // const all_user = await user_schema.find({})
  res.json({status:true , data : user_data})

})




module.exports = router