const createHttpError = require("http-errors");
const createError = require("http-errors");

module.exports = {
  uploadImage: (req, res) => {
    console.log("req.file.filename", req.file.filename);
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, data: null, message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: imageUrl,
    });
  },
};
