import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Schmea SQL 처럼 DATA의 규칙을 짜는괴정
// Model -> CREATE THE MODEL BASED ON THE Schema
const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  genderPreference: {
    type: String,
    required: true,
    enum: ["male", "female", "both"],
  },
  bio: { type: String, default: "" },
  images: { type: String, default: "" },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Before save the password this process hash the password.
userShema.pre("save", async function (next) {
  // 1234 => $3213123
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare the saved password and enteredPassword
// Add the matches funciton to Schema
userShema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userShema);
