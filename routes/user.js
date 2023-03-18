const express = require("express");
const router = express.Router();
require("dotenv").config();
// const database = require("../db/schema")
const user_Schema = require("../db/userschema")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');
var jwt_screte="thisismy secrete"


router.post('/user/signup',
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

    const data = await user_Schema.create({
        fName:req.body.fName,
        password:secpassword,
        email:req.body.email
    })
    

    res.json({
        success:true,
        data
    })
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
        return res.json({status:false,err:"wrong cred"})
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
    // const data = {
    //     user: {
    //       id: dataa.id,
    //     },
    //   };
    const auth_token = jwt.sign(jwt_data,jwt_screte)
    res.json({
        success:true,
        data,
        auth_token:auth_token
    })
   }
   catch(e){
    console.log(e);
   }


})


module.exports = router