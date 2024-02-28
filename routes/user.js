const express = require("express");
const router = express.Router();
require("dotenv").config();
// const database = require("../db/schema")
const user_Schema = require("../db/userschema")
const attandence_schema= require("../db/attandence")

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

////////////////////
const fetchperson = require('./middelware/fun')
/////////////////
var jwt = require('jsonwebtoken');
var jwt_screte="thisismy secrete"


router.post('user/signup',
body('email','not a email').isEmail(),
// password must be at least 5 chars long
body('password','min 5').isLength({ min: 5 }),
body('fName','fname incorrect').isLength({ min: 5 }),
async (req,res)=>{
    // req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   try{
    const salt = await bcrypt.genSalt(10)
    let secpassword = await bcrypt.hash(req.body.password,salt)
    const d = await user_Schema.find({email : req.body.email})
    if(d){
      return res.json({success:true,error:"email is already present"})
    }else{
      const data = await user_Schema.create({
        fName:req.body.fName,
        password:secpassword,
        email:req.body.email
    })
    

    res.json({
        success:true,
        data
    })
    }
   
   }catch{
    console.log('any error');
   }
    
})
//////////////////////////////////////////////////////////////
router.post('/user/signin',
body('email','not a email').isEmail(),
body('password','min 5').isLength({ min: 5 }),
async (req,res)=>{
    // req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   try{
    // const em = req.body.email;
    const data = await user_Schema.findOne({email : req.body.email})
    // console.log(data);
    if(!data){
         res.json({status:false,err:"wrong cred"})
    }
     const pwdcompare = bcrypt.compare(data.password,req.body.password)
     
    if(!pwdcompare){
        return res.json({status:false,err:"wrong pass"})
    }
    /////////////////////////////////////token
    const jwt_data={
        user_id:{
            id:data.id
        }
    }
    
    let date = new Date();
let options = {
  timeZone: "Asia/Kolkata",
  hour12: false,
  hour: "numeric",
  minute: "numeric",
  second: "numeric"
};

let istTime = date.toLocaleString("en-US", options);
console.log(istTime);
////////////
// const currentDate = new Date();
// const optionss = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
// const formattedDate = currentDate.toLocaleDateString(undefined, optionss);

// console.log(formattedDate);

/////////
    await attandence_schema.create({
        // day:new Date.now(),
        student_id: data.id,
        student:data.fName,
        login_time:istTime
    })

    // const data = {
    //     user: {
    //       id: dataa.id,
    //     },
    //   };
    // localStorage.setItem(auth_token)
    const auth_token = jwt.sign(jwt_data,jwt_screte)
    res.json({
        success:true,
        data,
        auth_token:auth_token,
        time_enter:istTime
    })
   }
   catch(e){
    console.log(e);
   }


})

////////////////////////////////////logout
router.post('/user/logout',fetchperson,async(req,res)=>{

    let date = new Date();
    let options = {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    };
    
    let istTime = date.toLocaleString("en-US", options);
    // console.log(istTime);
      
    // let data = await attandence_schema.findOne({
    //   student_id : req.mongoid
    // })


    // const updatedResult = await attandence_schema.findByIdAndUpdate(
    //   { _id: data.id },
    //   {
    //     logout_time: istTime,
    //   },
    // );
    // console.log();
/////

const currentDate = new Date(Date.now());
const optionss = { timeZone: 'Asia/Kolkata' };
const formattedDate = currentDate.toLocaleString('en-IN', optionss);
const extractedDate = formattedDate.substr(0, 9);


/////
      await attandence_schema.findOneAndUpdate(
        { 
          student_id: req.mongoid,
          day : extractedDate
        },
        { $set: { logout_time : istTime } },
        { new: true}
      )

      res.json({success:true}  )
})
////////////////////////////////////
router.get('/user/home_data',fetchperson,async(req,res)=>{
  // let data = await attandence_schema.find({})
  // const user_attandence = await attandence_schema.find({
  //   student_id : req.mongoid
  // })
        // req.mongoid
        console.log("home");
      res.json({success:true ,data :"home aagya"})
})


module.exports = router