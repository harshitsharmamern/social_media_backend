const express = require("express");
const router = express.Router();
require("dotenv").config();
const database = require("../db/schema")
const vertical_db = require("../db/vertical")
const course_db = require("../db/courses")

// c

router.post('/addvertical',async(req,res)=>{
  
  const data = await vertical_db.create(req.body);

  res.json(
    data
  )
})

router.post('/vertical/:verticalId/addcourse',async(req,res)=>{
  
    const {verticalId}  = req.params
    const coursedoc = await course_db.create(req.body)
    const data = await vertical_db.findByIdAndUpdate(
      {_id:verticalId},
      {$push : {courses_id:coursedoc._id}},
      {new:true}
    )
    res.status(200).json({status:"course create sucess",data})
   
})

router.post('/addcourse',async(req,res)=>{
  
  const data = await course_db.create(req.body);

  res.json(
    data
  )
})

router.get('/dummy',async(req,res)=>{
 
  const data = await database.find();

  res.json(
    data
  )
})
router.post("/dummy", async (req, res) => {
    
    const data = await database.create(req.body);
    
    res.status(200).json("data added succes");

  });

  module.exports = router;

