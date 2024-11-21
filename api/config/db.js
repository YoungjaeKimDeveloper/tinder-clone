import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const dataConnection = await mongoose.connect(process.env.MONG_URL);
    console.log("DATA CONNECTED");
  } catch (error) {
    console.log("FAILED TO CONNECT TO DATABASE : ", error.message);
    process.exit(1); //exit process with failure, 0 for success
  }
};
