const express = require("express");
require("./db/connection.js");
const cookieParser = require("cookie-parser");
const mainRouter = require("./routes/mainRouter.js");
const cors = require("cors");
var ghpages = require('gh-pages');

// ghpages.publish('dist', function(err) {});
const app = express();
const port = process.env.PORT
const origin1 = process.env.FRONTEND || process.env.FRONTEND_LOCAL
app.use(cors({
  origin: origin1,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api", mainRouter);
// app.use("/",Router)

app.listen(port, () => {
  console.log(`app is listening on port http://localhost:${port}`);
});
