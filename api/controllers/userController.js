import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    // images =>cloudary ->image.cloudianry.your=>MongoDB
    // 업데이트 할 정보 받아오기
    const { image, ...otherData } = req.body;

    const updatedData = otherData;
    // 사진이 있을경우 cloudinary
    // TODO : EXPLAIN THIS ONCE AGAIN IN THE UI PART
    if (image) {
      // base64 format
      if (image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadResponse.secure_url;
        } catch (error) {
          console.error("ERROR UPLOADING IMAGE: ", error.message);
          res.status(400).json({
            success: false,
            message: "ERROR UPLOADING IMAGE",
          });
        }
      }
    }
    // 업데이트할 이미지가 없는경우
    const updateUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      user: updateUser,
    });
  } catch (error) {
    console.log("Update Profile Logic ERROR : ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal ERROR IN USER CONTROLLER.js",
    });
  }
};
