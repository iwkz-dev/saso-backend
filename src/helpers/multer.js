const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  uploadArray: (name, count) => {
    return upload.array(name, count);
  },

  uploadSingle: (name) => {
    return upload.single(name);
  },
};
