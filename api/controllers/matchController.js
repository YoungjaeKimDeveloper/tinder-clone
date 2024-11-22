import { User } from "../models/User.js";
export const swipeLeft = async (req, res) => {
  try {
  } catch (error) {}
};

export const swipeRight = async (req, res) => {
  try {
  } catch (error) {}
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name image"
    );
    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (error) {
    console.log("Error in getMatches: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error  @getMatches",
    });
  }
};

export const getUserProfiles = async (req, res) => {
  try {
  } catch (error) {}
};

// 1:06:11
