const express = require("express");
const router = express.Router();
require("dotenv").config();
// const database = require("../db/schema")
// const user_Schema = require("../db/userschema")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const vertical_db = require("../db/vertical")
const course_db = require("../db/courses")
const user_Schema = require("../db/userschema")



const fetch_person = require('./middelware/fun')
router.get('/inside',fetch_person,async(req,res)=>{
    const user = await user_Schema.findById({_id:req.mongoid})
    // console.log(user);
    const data = await vertical_db.find({})
    res.status(200).json({data,user});
})

//  `${server}/vertical/${verticalId}/course
router.get('/vertical/:verticalId/course',fetch_person,async(req,res)=>{
    try{
        const {verticalId} = req.params
    const vertical = await vertical_db.findById({_id:verticalId})
    const vertical_courses = await course_db.find({
       _id:{ $in: vertical.courseIds}
    })
    res.json({courses:vertical_courses})
}catch{
    console.log("backend err");
    res.json({msg:"backend err"})
}
})




module.exports = router