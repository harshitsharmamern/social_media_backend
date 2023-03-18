const express = require("express");


var jwt = require('jsonwebtoken');
var jwt_screte="thisismy secrete"
const fetch_person=(req,res,next)=>{
     
      const token = req.header("auth-token")
      if(!token){
        res.status(401).json({err:'you mst be logedin'})
      }
      try{
        const data = jwt.verify(token,jwt_screte)
        
        req.mongoid = data.user_id.id
        // req.user = j;
        
        next();
      }catch{
          res.send({err:'errorrr'})
      }
    
      
}
module.exports = fetch_person

// const jwt_data={
//     user_id:{
//         id:data.id
//     }
// }
  