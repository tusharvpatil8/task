const express = require("express");
const router = express.Router();
const fileUploadController = require("../controller/common/fileUpload.controller");
const upload = require("../middleware/multer.upload");

//---------------------- file upload ----------------------//

router.post("/image", upload.single("image"), fileUploadController.uploadImage);

module.exports = router;
