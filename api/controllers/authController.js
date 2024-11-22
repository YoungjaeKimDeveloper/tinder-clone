import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

// 이제 여기에서부터 각각의 Routes에 대응하는 Controller를 만들어주면된다.
const signToToken = (id) => {
  // JWT TOKEN GENERATION
  return jwt.sign({ id }, process.env.SECRETKEY, {
    expiresIn: "7d",
  });
};
export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "FAIL, PLEASE FILL UP THE FORM PLEASE",
      });
    }
    if (age < 18) {
      return res.status(400).send({
        success: false,
        message: "YOU SHOULD BE AT LEAST 18 YEARS OLD",
      });
    }
    if (password.legnth < 6) {
      return res.status(400).json({
        success: false,
        message: "THE PASSWORD SHOULD BE AT LEAST MORE THAN 6 LETTERS",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });
    // Check the Token to verift the user
    const token = signToToken(newUser._id);
    // BASIC SETTING FOR COOKIE
    // res.cookie("jwt", token);

    // SEND THE COOKIE OPTION
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOny: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV == "production",
    });

    newUser.save();
    console.log("NEW ACCOUNT HAS BEEN CREATED SUCCESSFULLY");
    res.status(201).json({
      success: true,
      message: "New Account has been created",
      user: newUser,
    });
  } catch (error) {
    console.log("Sign Up ERROR ", error.message);
    res.status(400).send({ message: "Fail to create new account" });
  }
};

export const login = async (req, res) => {
  // 값 가져오기
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "PLEASE FILL UP THE ALL FORM" });
    }
    // User 찾기
    const currentUser = await User.findOne({ email }).select("+password");
    if (!currentUser || !(await currentUser.matchPassword(password))) {
      console.log("Sign in ERROR ", error.message);
      res.status(400).send({ message: "Cannot Find the User" });
    }
    // Token보내주기
    const token = signToToken(currentUser._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // 7 days in milliseconds
    });
    res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    console.log("Sign in ERROR ", error.message);
    res.status(400).send({ message: "Fail to Login" });
  }
};

export const logout = async (req, res) => {
  console.log("LOGOUT Successfully");
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "LOGOUT SUCCESSFULLY" });
};
