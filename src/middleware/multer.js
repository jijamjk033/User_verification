const multer = require('multer');
const path = require('path');

const storeUser = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, './public/assets/images/users/');
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});


module.exports = {
  uploadUser: multer({ storage: storeUser })
};
