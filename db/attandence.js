const mongoose = require("mongoose");
const currentDate = new Date(Date.now());
const options = { timeZone: 'Asia/Kolkata' };
const formattedDate = currentDate.toLocaleString('en-IN', options);
const extractedDate = formattedDate.substr(0, 9);
console.log(extractedDate);
const database1 = mongoose.Schema({
  student_id: {
    type: String,
  },
  student: {
    type: String,
  },
  day:{
    type : String,
  
    default : extractedDate
  },
  login_time:{
    type : String,
    
  },
  logout_time :{
    type : String,
  }
  
});
const Admin = mongoose.model("attandence", database1);

module.exports = Admin;
