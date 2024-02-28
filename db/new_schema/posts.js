const mongoose = require("mongoose");
const mongo = mongoose.Types.ObjectId;
const database1 = mongoose.Schema({

  title: {
    type: String
  },
  description: {
    type: String
  },
  postedby: {
    type: mongo,
    ref: "user"
  },
  comment: [{
    type: mongo,
    ref: "user"
  }
  ],
  like: [{
    type: mongo,
    ref: "user",
  }
  ],
  like_id: [{
    type: String,

  }
  ],


});
const userregis = mongoose.model("post", database1);

module.exports = userregis;
