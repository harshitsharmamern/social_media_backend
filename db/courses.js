const mongoose = require("mongoose");

const database1 = mongoose.Schema({
   name: {
    type: String,
  },
  
   description :{
    type:String
  },
  unit:{
    type:Array,
    default:[]
  },
  
  
});
const userregis = mongoose.model("courses", database1);

module.exports = userregis;
