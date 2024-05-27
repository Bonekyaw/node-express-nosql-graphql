const asyncHandler = require("express-async-handler");
const { unlink } = require("node:fs/promises");
const path = require("path");
const validator = require("validator");

const Admin = require("../models/admin");

const { checkAdmin, checkUploadFile } = require("./../utils/check");

exports.uploadProfile = asyncHandler(async (req, res, next) => {
  // const id = req.params.id;
  const id = req.adminId;
  const image = req.file;
  // console.log("Multiple Images array", req.files);  // For multiple files uploaded

  const admin = await Admin.findById(id);
  checkAdmin(admin);
  checkUploadFile(image);
  const imageUrl = image.path.replace("\\", "/");

  if (admin.profile) {
    try {
      await unlink(
        path.join(__dirname, "..", validator.unescape(admin.profile))
      ); // Delete an old profile image because it accepts just one.
    } catch (error) {
      res
        .status(200)
        .json({
          message: "Successfully uploaded the image.",
          profile: imageUrl,
        });
    }
  }

  //   admin.profile = imageUrl;
  //   await admin.save();

  res
    .status(200)
    .json({ message: "Successfully uploaded the image.", profile: imageUrl });
});