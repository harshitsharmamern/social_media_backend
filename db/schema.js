const mongoose = require("mongoose");

const database1 = mongoose.Schema({
  fName: {
    type: String,
  },
  
  hobbie :[
    {
      game:String,
      books:String,
      education:String,
      college:String,
    }
  
  ]
  
});
const Admin = mongoose.model("admin", database1);

module.exports = Admin;
