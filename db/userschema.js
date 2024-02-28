const mongoose = require("mongoose");

const database1 = mongoose.Schema({
  fName: {
    type: String,
  },
  
  password :{
    type:String
  },
  email:{
    type:String
  },

  
});
const userregis = mongoose.model("old_user", database1);

module.exports = userregis;
