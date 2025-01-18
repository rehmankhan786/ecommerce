require("dotenv").config();

const mongoose = require("mongoose");
const mongoose_url = process.env.MONGOOSE_URI;

mongoose
  .connect(mongoose_url, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    dbName: "ecommerce",
  })
  .then(() => {
    console.log("mongoose Database Connected");
  })
  .catch((error) => console.log("error"));
