const mongoose = require("mongoose");

const database1 = mongoose.Schema({
   name: {
    type: String,
  },
   description :{
    type:String
  },
  courses_id:{
    type:Array,
    default:[]
  }
});
const userregis = mongoose.model("vertical", database1);
module.exports = userregis;