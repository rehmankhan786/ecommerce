const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(`${__dirname}/../uploads`);
    cb(null, `${path.join(__dirname, "/../uploads")}`);
  },
  filename: (req, file, cb) => {
    const customFileName = `${Date.now()}-${file.originalname}`;
    cb(null, customFileName);
  },
});
const upload = multer({ storage });
module.exports = { upload };
