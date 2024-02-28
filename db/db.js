const mongoose = require("mongoose");
// require("dotenv").config();
// const 
const link="mongodb+srv://sharmaharshit769:portfolio@cluster0.ofeae87.mongodb.net/social_media"

// const link = "mongodb://localhost:27017/data_base"
// const link = process.env.DATABASE
const connectToMongo = () => {
  mongoose
    .connect(link)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log("Some error occured in database connection", err);
    });
};

module.exports = connectToMongo;
