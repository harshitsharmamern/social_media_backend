const express = require("express");
const app = express();
const connectToMongo = require("./db/db");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
// const port = 5000
const port= process.env.PORT || 5000
// to use req.body
app.use(express.json());

connectToMongo();
app.use("/",(req,res)=>{
  
  res.json("chal bya backengd")
});

app.use("/api",require("./routes/route"));
app.use("/api",require("./routes/user"));
app.use("/api",require("./routes/page"));


app.listen(port, () => {
  console.log("Server is listening at port 5000");
});

// localhost:5000/api/auth/createuser